/* ============================================
   AirDraw AI — Application Logic
   MediaPipe Hands + Canvas Drawing Engine
   ============================================ */

(function () {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        colors: [
            { hex: '#00d4ff', name: 'Cyan' },
            { hex: '#a855f7', name: 'Purple' },
            { hex: '#ec4899', name: 'Pink' },
            { hex: '#f97316', name: 'Orange' },
            { hex: '#fbbf24', name: 'Yellow' },
            { hex: '#34d399', name: 'Emerald' },
            { hex: '#ff3b5c', name: 'Red' },
            { hex: '#ffffff', name: 'White' },
        ],
        defaultBrushSize: 6,
        smoothFactor: 0.55,            // Coordinate smoothing (0=very smooth, 1=raw)
        minPointDistance: 2,            // Min px between drawing points
        clearHoldDuration: 1200,        // ms to hold peace sign to clear
        colorChangeCooldown: 800,       // ms cooldown between color changes
        handConnections: [
            [0,1],[1,2],[2,3],[3,4],
            [0,5],[5,6],[6,7],[7,8],
            [5,9],[9,10],[10,11],[11,12],
            [9,13],[13,14],[14,15],[15,16],
            [13,17],[17,18],[18,19],[19,20],
            [0,17],
        ],
        skeletonColor: 'rgba(0, 212, 255, 0.35)',
        landmarkColor: 'rgba(0, 212, 255, 0.55)',
        cameraWidth: 1280,
        cameraHeight: 720,
    };

    // ============================================
    // STATE
    // ============================================
    const state = {
        currentColor: CONFIG.colors[0].hex,
        colorIndex: 0,
        brushSize: CONFIG.defaultBrushSize,
        isDrawing: false,
        handDetected: false,
        currentGesture: 'IDLE',
        prevGesture: 'IDLE',
        cameraActive: true,
        panelCollapsed: false,

        // Drawing
        smoothedPoint: null,
        lastDrawPoint: null,
        currentStrokePoints: [],

        // Clear gesture timing
        clearGestureStart: 0,
        clearInProgress: false,

        // Color change timing
        lastColorChangeTime: 0,

        // FPS tracking
        frameCount: 0,
        lastFpsUpdate: 0,
        fps: 0,

        // Animation
        animTime: 0,
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const els = {
        loadingScreen: $('#loadingScreen'),
        loadingText: $('#loadingText'),
        loadingBarFill: $('#loadingBarFill'),
        app: $('#app'),
        webcam: $('#webcam'),
        drawCanvas: $('#drawCanvas'),
        overlayCanvas: $('#overlayCanvas'),
        canvasWrapper: $('#canvasWrapper'),

        statusDot: $('#statusDot'),
        statusText: $('#statusText'),
        gesturePill: $('#gesturePill'),
        gestureIcon: $('#gestureIcon'),
        gestureText: $('#gestureText'),
        fpsCounter: $('#fpsCounter'),

        controlsPanel: $('#controlsPanel'),
        panelToggle: $('#panelToggle'),
        panelContent: $('#panelContent'),
        colorGrid: $('#colorGrid'),
        customColorInput: $('#customColorInput'),
        brushSizeSlider: $('#brushSizeSlider'),
        sizeValue: $('#sizeValue'),
        brushPreview: $('#brushPreview'),

        clearBtn: $('#clearBtn'),
        cameraBtn: $('#cameraBtn'),
        saveBtn: $('#saveBtn'),

        clearProgress: $('#clearProgress'),
        clearRingFill: $('#clearRingFill'),
        colorFlash: $('#colorFlash'),
        toast: $('#toast'),
        toastIcon: $('#toastIcon'),
        toastText: $('#toastText'),
    };

    const drawCtx = els.drawCanvas.getContext('2d');
    const overlayCtx = els.overlayCanvas.getContext('2d');

    // ============================================
    // CANVAS SETUP
    // ============================================
    function resizeCanvases() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        // Save current drawing
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = els.drawCanvas.width || w;
        tempCanvas.height = els.drawCanvas.height || h;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(els.drawCanvas, 0, 0);

        els.drawCanvas.width = w;
        els.drawCanvas.height = h;
        els.overlayCanvas.width = w;
        els.overlayCanvas.height = h;

        // Restore drawing (scaled)
        drawCtx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, w, h);
    }

    // ============================================
    // COLOR GRID
    // ============================================
    function buildColorGrid() {
        els.colorGrid.innerHTML = '';
        CONFIG.colors.forEach((c, i) => {
            const swatch = document.createElement('button');
            swatch.className = 'color-swatch' + (i === state.colorIndex ? ' active' : '');
            swatch.style.background = c.hex;
            swatch.style.setProperty('--swatch-glow', c.hex + '66');
            swatch.title = c.name;
            swatch.setAttribute('aria-label', 'Color: ' + c.name);
            swatch.addEventListener('click', () => selectColor(i));
            els.colorGrid.appendChild(swatch);
        });
    }

    function selectColor(index) {
        state.colorIndex = index;
        state.currentColor = CONFIG.colors[index].hex;
        updateColorUI();
    }

    function selectColorHex(hex) {
        state.currentColor = hex;
        // Deselect swatches if custom
        const idx = CONFIG.colors.findIndex(c => c.hex.toLowerCase() === hex.toLowerCase());
        state.colorIndex = idx;
        updateColorUI();
    }

    function updateColorUI() {
        const swatches = els.colorGrid.querySelectorAll('.color-swatch');
        swatches.forEach((s, i) => {
            s.classList.toggle('active', i === state.colorIndex);
        });
        els.brushPreview.style.background = state.currentColor;
        els.brushPreview.style.boxShadow = `0 0 14px ${state.currentColor}55`;
        els.customColorInput.value = state.currentColor;
    }

    // ============================================
    // BRUSH SIZE
    // ============================================
    function updateBrushSize(size) {
        state.brushSize = size;
        els.sizeValue.textContent = size + 'px';
        els.brushPreview.style.width = size + 'px';
        els.brushPreview.style.height = size + 'px';
    }

    // ============================================
    // UI SETUP
    // ============================================
    function setupUI() {
        buildColorGrid();
        updateBrushSize(state.brushSize);
        updateColorUI();

        // Panel toggle
        els.panelToggle.addEventListener('click', () => {
            state.panelCollapsed = !state.panelCollapsed;
            els.controlsPanel.classList.toggle('collapsed', state.panelCollapsed);
        });

        // Brush size slider
        els.brushSizeSlider.addEventListener('input', (e) => {
            updateBrushSize(parseInt(e.target.value));
        });

        // Custom color
        els.customColorInput.addEventListener('input', (e) => {
            selectColorHex(e.target.value);
        });

        // Clear button
        els.clearBtn.addEventListener('click', clearCanvas);

        // Camera toggle
        els.cameraBtn.addEventListener('click', toggleCamera);

        // Save button
        els.saveBtn.addEventListener('click', saveDrawing);

        // Resize
        window.addEventListener('resize', resizeCanvases);
    }

    // ============================================
    // STATUS & GESTURE DISPLAY
    // ============================================
    function updateStatus(text, dotClass) {
        els.statusText.textContent = text;
        els.statusDot.className = 'status-dot ' + (dotClass || '');
    }

    function updateGestureDisplay(gesture) {
        const map = {
            'IDLE':         { icon: '✋', text: 'IDLE',    cls: '' },
            'DRAW':         { icon: '☝️', text: 'DRAWING', cls: 'draw' },
            'STOP':         { icon: '✊', text: 'STOPPED', cls: 'stop' },
            'CLEAR':        { icon: '✌️', text: 'CLEAR',   cls: 'clear-mode' },
            'CHANGE_COLOR': { icon: '🖐️', text: 'COLOR',   cls: 'color-mode' },
        };
        const info = map[gesture] || map['IDLE'];
        els.gestureIcon.textContent = info.icon;
        els.gestureText.textContent = info.text;
        els.gesturePill.className = 'gesture-pill ' + info.cls;

        // Highlight active gesture in guide
        const gestureItems = $$('.gesture-item');
        const gestureOrder = ['DRAW', 'STOP', 'CLEAR', 'CHANGE_COLOR'];
        gestureItems.forEach((item, i) => {
            item.classList.toggle('active-gesture', gestureOrder[i] === gesture);
        });
    }

    // ============================================
    // TOAST NOTIFICATIONS
    // ============================================
    let toastTimer = null;
    function showToast(text, icon = '✅') {
        clearTimeout(toastTimer);
        els.toastText.textContent = text;
        els.toastIcon.textContent = icon;
        els.toast.classList.add('visible');
        toastTimer = setTimeout(() => {
            els.toast.classList.remove('visible');
        }, 2500);
    }

    // ============================================
    // CANVAS ACTIONS
    // ============================================
    function clearCanvas() {
        drawCtx.clearRect(0, 0, els.drawCanvas.width, els.drawCanvas.height);
        state.currentStrokePoints = [];
        state.lastDrawPoint = null;
        state.smoothedPoint = null;
        showToast('Canvas cleared', '🗑️');
    }

    function toggleCamera() {
        if (state.cameraActive) {
            // Stop camera
            const stream = els.webcam.srcObject;
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
            }
            els.webcam.srcObject = null;
            state.cameraActive = false;
            els.cameraBtn.querySelector('span:last-child').textContent = 'Start';
            updateStatus('Camera off', 'warning');
            showToast('Camera turned off', '📷');
        } else {
            // Restart — reload page for simplicity
            location.reload();
        }
    }

    function saveDrawing() {
        // Composite: background + drawing
        const saveCanvas = document.createElement('canvas');
        saveCanvas.width = els.drawCanvas.width;
        saveCanvas.height = els.drawCanvas.height;
        const saveCtx = saveCanvas.getContext('2d');

        // Dark background
        saveCtx.fillStyle = '#0a0a14';
        saveCtx.fillRect(0, 0, saveCanvas.width, saveCanvas.height);

        // Drawing (flip back since canvas is CSS-mirrored)
        saveCtx.save();
        saveCtx.translate(saveCanvas.width, 0);
        saveCtx.scale(-1, 1);
        saveCtx.drawImage(els.drawCanvas, 0, 0);
        saveCtx.restore();

        const link = document.createElement('a');
        link.download = 'airdraw-' + Date.now() + '.png';
        link.href = saveCanvas.toDataURL('image/png');
        link.click();
        showToast('Drawing saved!', '💾');
    }

    // ============================================
    // GESTURE DETECTION
    // ============================================
    function isFingerUp(landmarks, tipIdx, pipIdx) {
        return landmarks[tipIdx].y < landmarks[pipIdx].y;
    }

    function detectGesture(landmarks) {
        const indexUp  = isFingerUp(landmarks, 8, 6);
        const middleUp = isFingerUp(landmarks, 12, 10);
        const ringUp   = isFingerUp(landmarks, 16, 14);
        const pinkyUp  = isFingerUp(landmarks, 20, 18);

        const count = [indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length;

        // Open palm: all 4 fingers up
        if (count >= 4) return 'CHANGE_COLOR';

        // Peace sign: index + middle only
        if (indexUp && middleUp && !ringUp && !pinkyUp) return 'CLEAR';

        // Index only: draw
        if (indexUp && !middleUp && !ringUp && !pinkyUp) return 'DRAW';

        // Fist: nothing up
        if (count === 0) return 'STOP';

        return 'IDLE';
    }

    // ============================================
    // COORDINATE SMOOTHING
    // ============================================
    function smoothCoord(raw) {
        if (!state.smoothedPoint) {
            state.smoothedPoint = { x: raw.x, y: raw.y };
            return { ...state.smoothedPoint };
        }
        state.smoothedPoint.x += (raw.x - state.smoothedPoint.x) * CONFIG.smoothFactor;
        state.smoothedPoint.y += (raw.y - state.smoothedPoint.y) * CONFIG.smoothFactor;
        return { x: state.smoothedPoint.x, y: state.smoothedPoint.y };
    }

    function shouldAddPoint(current, previous) {
        if (!previous) return true;
        const dx = current.x - previous.x;
        const dy = current.y - previous.y;
        return Math.sqrt(dx * dx + dy * dy) > CONFIG.minPointDistance;
    }

    // ============================================
    // DRAWING ENGINE
    // ============================================
    function drawGlowLine(ctx, x1, y1, x2, y2, color, size) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Outer glow layer
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = size + 10;
        ctx.globalAlpha = 0.08;
        ctx.shadowBlur = 25;
        ctx.shadowColor = color;
        ctx.stroke();

        // Mid glow layer
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = size + 4;
        ctx.globalAlpha = 0.25;
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Core line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = size;
        ctx.globalAlpha = 0.9;
        ctx.shadowBlur = 6;
        ctx.stroke();

        // Hot center (bright white core)
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1, size * 0.3);
        ctx.globalAlpha = 0.4;
        ctx.shadowBlur = 0;
        ctx.stroke();

        ctx.restore();
    }

    function addDrawingPoint(x, y) {
        const smoothed = smoothCoord({ x, y });

        if (!shouldAddPoint(smoothed, state.lastDrawPoint)) return;

        if (state.lastDrawPoint) {
            drawGlowLine(
                drawCtx,
                state.lastDrawPoint.x, state.lastDrawPoint.y,
                smoothed.x, smoothed.y,
                state.currentColor,
                state.brushSize
            );
        }

        state.lastDrawPoint = { x: smoothed.x, y: smoothed.y };
    }

    // ============================================
    // HAND VISUALIZATION (Overlay Canvas)
    // ============================================
    function drawHandSkeleton(ctx, landmarks, w, h) {
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = CONFIG.skeletonColor;
        ctx.lineCap = 'round';

        // Draw connections
        for (const [a, b] of CONFIG.handConnections) {
            const pa = landmarks[a];
            const pb = landmarks[b];
            ctx.beginPath();
            ctx.moveTo(pa.x * w, pa.y * h);
            ctx.lineTo(pb.x * w, pb.y * h);
            ctx.stroke();
        }

        // Draw landmark dots
        for (let i = 0; i < landmarks.length; i++) {
            const lm = landmarks[i];
            const x = lm.x * w;
            const y = lm.y * h;
            const radius = (i === 8) ? 0 : 3; // Skip index tip (drawn separately)

            if (radius > 0) {
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = CONFIG.landmarkColor;
                ctx.fill();
            }
        }

        ctx.restore();
    }

    function drawFingertipIndicator(ctx, x, y, color, time, isDrawing) {
        ctx.save();

        const pulse = Math.sin(time * 0.006) * 0.3 + 0.7;

        if (isDrawing) {
            // Drawing mode: prominent pulsing ring
            const outerR = 18 * pulse;

            // Outer ring glow
            ctx.beginPath();
            ctx.arc(x, y, outerR + 5, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.15 * pulse;
            ctx.shadowBlur = 20;
            ctx.shadowColor = color;
            ctx.stroke();

            // Main ring
            ctx.beginPath();
            ctx.arc(x, y, outerR, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.globalAlpha = 0.6 * pulse;
            ctx.shadowBlur = 12;
            ctx.stroke();

            // Inner dot
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 8;
            ctx.fill();

            // White hot center
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.9;
            ctx.shadowBlur = 4;
            ctx.fill();
        } else {
            // Non-drawing: subtle dot
            const r = 8 * pulse;

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.4;
            ctx.shadowBlur = 8;
            ctx.shadowColor = color;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.7;
            ctx.fill();
        }

        ctx.restore();
    }

    // ============================================
    // CLEAR GESTURE HANDLER
    // ============================================
    const CIRCUMFERENCE = 2 * Math.PI * 52; // SVG circle circumference

    function updateClearProgress(gesture) {
        const now = performance.now();

        if (gesture === 'CLEAR') {
            if (!state.clearInProgress) {
                state.clearInProgress = true;
                state.clearGestureStart = now;
            }

            const elapsed = now - state.clearGestureStart;
            const progress = Math.min(elapsed / CONFIG.clearHoldDuration, 1);

            // Update ring
            els.clearRingFill.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
            els.clearProgress.classList.add('active');

            if (progress >= 1) {
                clearCanvas();
                state.clearInProgress = false;
                state.clearGestureStart = 0;
                els.clearProgress.classList.remove('active');
            }
        } else {
            if (state.clearInProgress) {
                state.clearInProgress = false;
                state.clearGestureStart = 0;
                els.clearRingFill.style.strokeDashoffset = CIRCUMFERENCE;
                els.clearProgress.classList.remove('active');
            }
        }
    }

    // ============================================
    // COLOR CHANGE HANDLER
    // ============================================
    function handleColorChange() {
        const now = performance.now();
        if (now - state.lastColorChangeTime < CONFIG.colorChangeCooldown) return;
        state.lastColorChangeTime = now;

        // Cycle to next color
        const nextIndex = (state.colorIndex + 1) % CONFIG.colors.length;
        selectColor(nextIndex);

        // Flash effect
        els.colorFlash.style.background = `radial-gradient(circle at center, ${state.currentColor}22 0%, transparent 70%)`;
        els.colorFlash.classList.remove('active');
        void els.colorFlash.offsetWidth; // trigger reflow
        els.colorFlash.classList.add('active');

        showToast(`Color: ${CONFIG.colors[nextIndex].name}`, '🎨');
    }

    // ============================================
    // FPS COUNTER
    // ============================================
    function updateFPS() {
        state.frameCount++;
        const now = performance.now();
        if (now - state.lastFpsUpdate >= 1000) {
            state.fps = state.frameCount;
            state.frameCount = 0;
            state.lastFpsUpdate = now;
            els.fpsCounter.textContent = state.fps + ' FPS';
        }
    }

    // ============================================
    // MAIN RESULTS HANDLER
    // ============================================
    function onResults(results) {
        updateFPS();
        state.animTime = performance.now();

        const w = els.overlayCanvas.width;
        const h = els.overlayCanvas.height;

        // Clear overlay canvas each frame
        overlayCtx.clearRect(0, 0, w, h);

        // No hand detected
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            state.handDetected = false;
            state.isDrawing = false;
            state.lastDrawPoint = null;
            state.smoothedPoint = null;
            updateStatus('Show your hand', '');
            updateGestureDisplay('IDLE');
            updateClearProgress('NONE');
            return;
        }

        state.handDetected = true;
        updateStatus('Hand tracked', 'active');

        const landmarks = results.multiHandLandmarks[0];

        // Draw hand skeleton
        drawHandSkeleton(overlayCtx, landmarks, w, h);

        // Get index fingertip position (in pixels)
        const tipX = landmarks[8].x * w;
        const tipY = landmarks[8].y * h;

        // Detect gesture
        const gesture = detectGesture(landmarks);
        state.currentGesture = gesture;
        updateGestureDisplay(gesture);

        // Handle gestures
        switch (gesture) {
            case 'DRAW':
                if (!state.isDrawing) {
                    // Start new stroke
                    state.isDrawing = true;
                    state.lastDrawPoint = null;
                    state.smoothedPoint = null;
                }
                addDrawingPoint(tipX, tipY);
                drawFingertipIndicator(overlayCtx, tipX, tipY, state.currentColor, state.animTime, true);
                updateClearProgress('NONE');
                break;

            case 'STOP':
                state.isDrawing = false;
                state.lastDrawPoint = null;
                state.smoothedPoint = null;
                drawFingertipIndicator(overlayCtx, tipX, tipY, 'rgba(255,255,255,0.3)', state.animTime, false);
                updateClearProgress('NONE');
                break;

            case 'CLEAR':
                state.isDrawing = false;
                state.lastDrawPoint = null;
                state.smoothedPoint = null;
                updateClearProgress('CLEAR');
                drawFingertipIndicator(overlayCtx, tipX, tipY, '#fbbf24', state.animTime, false);
                break;

            case 'CHANGE_COLOR':
                state.isDrawing = false;
                state.lastDrawPoint = null;
                state.smoothedPoint = null;
                handleColorChange();
                drawFingertipIndicator(overlayCtx, tipX, tipY, state.currentColor, state.animTime, false);
                updateClearProgress('NONE');
                break;

            default:
                state.isDrawing = false;
                state.lastDrawPoint = null;
                state.smoothedPoint = null;
                drawFingertipIndicator(overlayCtx, tipX, tipY, 'rgba(255,255,255,0.3)', state.animTime, false);
                updateClearProgress('NONE');
                break;
        }

        state.prevGesture = gesture;
    }

    // ============================================
    // MEDIAPIPE INITIALIZATION
    // ============================================
    function initHandTracking() {
        setLoadingProgress(20, 'Loading hand tracking model...');

        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5,
        });

        hands.onResults(onResults);

        setLoadingProgress(50, 'Accessing webcam...');

        const camera = new Camera(els.webcam, {
            onFrame: async () => {
                await hands.send({ image: els.webcam });
            },
            width: CONFIG.cameraWidth,
            height: CONFIG.cameraHeight,
        });

        camera.start().then(() => {
            setLoadingProgress(80, 'Warming up...');

            // Give time for model warm-up
            setTimeout(() => {
                setLoadingProgress(100, 'Ready!');
                setTimeout(() => {
                    els.loadingScreen.classList.add('fade-out');
                    els.app.classList.remove('hidden');
                    updateStatus('Show your hand', 'warning');
                    setTimeout(() => {
                        els.loadingScreen.style.display = 'none';
                    }, 600);
                }, 400);
            }, 1500);
        }).catch(err => {
            console.error('Camera error:', err);
            setLoadingProgress(0, 'Camera access denied. Please allow camera permissions and reload.');
        });
    }

    // ============================================
    // LOADING PROGRESS
    // ============================================
    function setLoadingProgress(percent, text) {
        els.loadingBarFill.style.width = percent + '%';
        if (text) els.loadingText.textContent = text;
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        resizeCanvases();
        setupUI();

        // Set initial loading bar SVG
        els.clearRingFill.style.strokeDasharray = CIRCUMFERENCE;
        els.clearRingFill.style.strokeDashoffset = CIRCUMFERENCE;

        // Small delay to let DOM settle
        setTimeout(() => {
            initHandTracking();
        }, 200);
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
