import React, {
  useEffect, useRef, useState, useCallback, useMemo
} from 'react';
import { useAuth } from '../../context/AuthContext';
import { rtdb } from '../../services/firebase';
import { ref, onValue, set, push, onDisconnect, remove } from 'firebase/database';
import './LoveDraw.css';

// ═══════════════════════════════════════════════════════════════════
//  TEMPLATE SYSTEM — SVG-based faint guide outlines
// ═══════════════════════════════════════════════════════════════════

const TEMPLATE_CATEGORIES = ['Romantic', 'Half-Draw', 'Cute', 'Trendy'];

const TEMPLATES = [
  // ── ROMANTIC ──────────────────────────────────────────────────
  {
    id: 'moon-couple', label: 'Moon & Couple', category: 'Romantic', emoji: '🌙',
    color: '#9b59b6',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h / 2;
      ctx.globalAlpha = 0.07;
      ctx.strokeStyle = '#9b59b6'; ctx.lineWidth = 2.5;
      // Moon
      ctx.beginPath();
      ctx.arc(cx - w * 0.18, h * 0.22, h * 0.14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - w * 0.1, h * 0.18, h * 0.11, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill(); // mask
      // Ground
      ctx.beginPath(); ctx.moveTo(w * 0.1, h * 0.72); ctx.bezierCurveTo(cx, h * 0.62, cx, h * 0.62, w * 0.9, h * 0.72); ctx.stroke();
      // Left person
      ctx.beginPath(); ctx.arc(cx - w * 0.1, h * 0.52, h * 0.04, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - w * 0.1, h * 0.56); ctx.lineTo(cx - w * 0.1, h * 0.68);
      ctx.moveTo(cx - w * 0.1, h * 0.6); ctx.lineTo(cx - w * 0.04, h * 0.63);
      ctx.moveTo(cx - w * 0.1, h * 0.68); ctx.lineTo(cx - w * 0.13, h * 0.76);
      ctx.moveTo(cx - w * 0.1, h * 0.68); ctx.lineTo(cx - w * 0.07, h * 0.76); ctx.stroke();
      // Right person
      ctx.beginPath(); ctx.arc(cx + w * 0.06, h * 0.52, h * 0.04, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + w * 0.06, h * 0.56); ctx.lineTo(cx + w * 0.06, h * 0.68);
      ctx.moveTo(cx + w * 0.06, h * 0.6); ctx.lineTo(cx, h * 0.63);
      ctx.moveTo(cx + w * 0.06, h * 0.68); ctx.lineTo(cx + w * 0.03, h * 0.76);
      ctx.moveTo(cx + w * 0.06, h * 0.68); ctx.lineTo(cx + w * 0.09, h * 0.76); ctx.stroke();
    }
  },
  {
    id: 'holding-hands', label: 'Holding Hands', category: 'Romantic', emoji: '🤝',
    color: '#e84393',
    draw: (ctx, w, h) => {
      const cy = h * 0.5;
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#e84393'; ctx.lineWidth = 3;
      // Left arm
      ctx.beginPath(); ctx.moveTo(w * 0.05, cy - h * 0.12);
      ctx.bezierCurveTo(w * 0.15, cy - h * 0.15, w * 0.28, cy - h * 0.08, w * 0.4, cy);
      ctx.stroke();
      // Right arm
      ctx.beginPath(); ctx.moveTo(w * 0.95, cy - h * 0.12);
      ctx.bezierCurveTo(w * 0.85, cy - h * 0.15, w * 0.72, cy - h * 0.08, w * 0.6, cy);
      ctx.stroke();
      // Clasped hands (fingers)
      for (let i = 0; i < 4; i++) {
        const x = w * 0.42 + i * w * 0.045;
        ctx.beginPath(); ctx.moveTo(x, cy - h * 0.04); ctx.lineTo(x, cy - h * 0.14); ctx.stroke();
        const x2 = w * 0.58 - i * w * 0.045;
        ctx.beginPath(); ctx.moveTo(x2, cy + h * 0.04); ctx.lineTo(x2, cy + h * 0.14); ctx.stroke();
      }
      // Palm area
      ctx.beginPath(); ctx.ellipse(w * 0.48, cy - h * 0.02, w * 0.08, h * 0.05, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(w * 0.52, cy + h * 0.02, w * 0.08, h * 0.05, 0, 0, Math.PI * 2); ctx.stroke();
    }
  },
  {
    id: 'heart', label: 'Heart', category: 'Romantic', emoji: '💗',
    color: '#ff6b81',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h * 0.44;
      const r = Math.min(w, h) * 0.22;
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#ff6b81'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy + r * 0.92);
      ctx.bezierCurveTo(cx - r * 2.1, cy - r * 0.42, cx - r * 2.1, cy - r * 2, cx, cy - r * 0.68);
      ctx.bezierCurveTo(cx + r * 2.1, cy - r * 2, cx + r * 2.1, cy - r * 0.42, cx, cy + r * 0.92);
      ctx.stroke();
    }
  },
  {
    id: 'swing-couple', label: 'Swing Kiss', category: 'Romantic', emoji: '🌸',
    color: '#ff9ff3',
    draw: (ctx, w, h) => {
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#ff9ff3'; ctx.lineWidth = 2.5;
      // Tree branch
      ctx.beginPath(); ctx.moveTo(w * 0.1, h * 0.08); ctx.bezierCurveTo(w * 0.3, h * 0.04, w * 0.6, h * 0.06, w * 0.85, h * 0.1); ctx.stroke();
      // Swing ropes
      ctx.beginPath(); ctx.moveTo(w * 0.38, h * 0.1); ctx.lineTo(w * 0.35, h * 0.52); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w * 0.62, h * 0.1); ctx.lineTo(w * 0.65, h * 0.52); ctx.stroke();
      // Seat
      ctx.beginPath(); ctx.moveTo(w * 0.35, h * 0.52); ctx.lineTo(w * 0.65, h * 0.52); ctx.stroke();
      // Person on swing
      ctx.beginPath(); ctx.arc(w * 0.5, h * 0.4, h * 0.05, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.45); ctx.lineTo(w * 0.5, h * 0.54);
      ctx.moveTo(w * 0.5, h * 0.48); ctx.lineTo(w * 0.42, h * 0.52);
      ctx.moveTo(w * 0.5, h * 0.48); ctx.lineTo(w * 0.58, h * 0.52); ctx.stroke();
      // Hearts above
      for (let i = 0; i < 3; i++) {
        const hx = w * (0.32 + i * 0.18), hy = h * (0.2 + i * 0.04), hr = h * 0.025;
        ctx.beginPath();
        ctx.moveTo(hx, hy + hr * 0.8);
        ctx.bezierCurveTo(hx - hr * 1.8, hy - hr * 0.5, hx - hr * 1.8, hy - hr * 1.8, hx, hy - hr * 0.6);
        ctx.bezierCurveTo(hx + hr * 1.8, hy - hr * 1.8, hx + hr * 1.8, hy - hr * 0.5, hx, hy + hr * 0.8);
        ctx.stroke();
      }
    }
  },
  {
    id: 'hug', label: 'Warm Hug', category: 'Romantic', emoji: '🫂',
    color: '#f9ca24',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h * 0.45;
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#f9ca24'; ctx.lineWidth = 2.5;
      // Two heads
      ctx.beginPath(); ctx.arc(cx - w * 0.08, h * 0.22, h * 0.055, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + w * 0.08, h * 0.22, h * 0.055, 0, Math.PI * 2); ctx.stroke();
      // Bodies hugging — curved arms around each other
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.08, h * 0.28);
      ctx.bezierCurveTo(cx - w * 0.22, h * 0.38, cx - w * 0.22, h * 0.6, cx - w * 0.08, h * 0.7);
      ctx.bezierCurveTo(cx, h * 0.72, cx, h * 0.72, cx + w * 0.08, h * 0.7);
      ctx.bezierCurveTo(cx + w * 0.22, h * 0.6, cx + w * 0.22, h * 0.38, cx + w * 0.08, h * 0.28);
      ctx.stroke();
      // Arms
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.08, h * 0.35);
      ctx.bezierCurveTo(cx + w * 0.18, h * 0.32, cx + w * 0.2, h * 0.52, cx, h * 0.55);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + w * 0.08, h * 0.35);
      ctx.bezierCurveTo(cx - w * 0.18, h * 0.32, cx - w * 0.2, h * 0.52, cx, h * 0.55);
      ctx.stroke();
    }
  },

  // ── HALF-DRAW ─────────────────────────────────────────────────
  {
    id: 'half-butterfly', label: 'Half Butterfly', category: 'Half-Draw', emoji: '🦋',
    color: '#6c5ce7',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h / 2;
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#6c5ce7'; ctx.lineWidth = 2.5;
      // Body center
      ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.015, h * 0.16, 0, 0, Math.PI * 2); ctx.stroke();
      // Left upper wing
      ctx.beginPath(); ctx.moveTo(cx, cy - h * 0.08);
      ctx.bezierCurveTo(cx - w * 0.28, cy - h * 0.32, cx - w * 0.4, cy - h * 0.1, cx, cy + h * 0.02);
      ctx.stroke();
      // Left lower wing
      ctx.beginPath(); ctx.moveTo(cx, cy + h * 0.02);
      ctx.bezierCurveTo(cx - w * 0.22, cy + h * 0.14, cx - w * 0.3, cy + h * 0.28, cx, cy + h * 0.14);
      ctx.stroke();
      // Right upper wing (faint — to complete)
      ctx.globalAlpha = 0.035;
      ctx.beginPath(); ctx.moveTo(cx, cy - h * 0.08);
      ctx.bezierCurveTo(cx + w * 0.28, cy - h * 0.32, cx + w * 0.4, cy - h * 0.1, cx, cy + h * 0.02);
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy + h * 0.02);
      ctx.bezierCurveTo(cx + w * 0.22, cy + h * 0.14, cx + w * 0.3, cy + h * 0.28, cx, cy + h * 0.14);
      ctx.stroke();
    }
  },
  {
    id: 'broken-heart', label: 'Broken → Whole', category: 'Half-Draw', emoji: '💔',
    color: '#ff6b81',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h * 0.42;
      const r = Math.min(w, h) * 0.21;
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#ff6b81'; ctx.lineWidth = 2.5;
      // Left half heart (solid guide)
      ctx.beginPath();
      ctx.moveTo(cx, cy + r * 0.92);
      ctx.bezierCurveTo(cx - r * 2.1, cy - r * 0.42, cx - r * 2.1, cy - r * 2, cx, cy - r * 0.68);
      ctx.stroke();
      // Right half (very faint — partner fills)
      ctx.globalAlpha = 0.03;
      ctx.beginPath();
      ctx.moveTo(cx, cy + r * 0.92);
      ctx.bezierCurveTo(cx + r * 2.1, cy - r * 0.42, cx + r * 2.1, cy - r * 2, cx, cy - r * 0.68);
      ctx.stroke();
      // Lightning crack in center
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#e84393';
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 0.5);
      ctx.lineTo(cx + w * 0.03, cy);
      ctx.lineTo(cx - w * 0.02, cy + r * 0.3);
      ctx.lineTo(cx, cy + r * 0.92);
      ctx.stroke();
    }
  },
  {
    id: 'yin-yang', label: 'Yin-Yang Love', category: 'Half-Draw', emoji: '☯️',
    color: '#2d3436',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h * 0.46, r = Math.min(w, h) * 0.24;
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 2.5;
      // Outer circle
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      // Upper S-curve
      ctx.beginPath(); ctx.arc(cx, cy - r / 2, r / 2, 0, Math.PI); ctx.stroke();
      // Lower S-curve
      ctx.beginPath(); ctx.arc(cx, cy + r / 2, r / 2, Math.PI, Math.PI * 2); ctx.stroke();
      // Small hearts instead of dots
      const hd = (hx, hy, hr) => {
        ctx.beginPath();
        ctx.moveTo(hx, hy + hr);
        ctx.bezierCurveTo(hx - hr * 2, hy - hr * 0.5, hx - hr * 2, hy - hr * 2, hx, hy - hr * 0.7);
        ctx.bezierCurveTo(hx + hr * 2, hy - hr * 2, hx + hr * 2, hy - hr * 0.5, hx, hy + hr);
        ctx.stroke();
      };
      hd(cx, cy - r / 2, r * 0.1);
      hd(cx, cy + r / 2, r * 0.1);
    }
  },
  {
    id: 'puzzle-heart', label: 'Puzzle Heart', category: 'Half-Draw', emoji: '🧩',
    color: '#00b894',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h * 0.44;
      const r = Math.min(w, h) * 0.22;
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#00b894'; ctx.lineWidth = 2.5;
      // Heart
      ctx.beginPath();
      ctx.moveTo(cx, cy + r * 0.92);
      ctx.bezierCurveTo(cx - r * 2.1, cy - r * 0.42, cx - r * 2.1, cy - r * 2, cx, cy - r * 0.68);
      ctx.bezierCurveTo(cx + r * 2.1, cy - r * 2, cx + r * 2.1, cy - r * 0.42, cx, cy + r * 0.92);
      ctx.stroke();
      // Puzzle divider
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 0.68);
      ctx.lineTo(cx, cy - r * 0.1);
      ctx.bezierCurveTo(cx + r * 0.18, cy - r * 0.1, cx + r * 0.18, cy + r * 0.18, cx, cy + r * 0.18);
      ctx.lineTo(cx, cy + r * 0.92);
      ctx.stroke();
    }
  },
  {
    id: 'half-rose', label: 'Half Rose', category: 'Half-Draw', emoji: '🌹',
    color: '#e84393',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h * 0.38;
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#e84393'; ctx.lineWidth = 2.5;
      // Stem
      ctx.beginPath(); ctx.moveTo(cx, cy + h * 0.14); ctx.bezierCurveTo(cx - w * 0.04, cy + h * 0.28, cx + w * 0.02, cy + h * 0.42, cx, cy + h * 0.56); ctx.stroke();
      // Rose left petals
      ctx.beginPath(); ctx.ellipse(cx - w * 0.1, cy, w * 0.1, h * 0.07, 0.4, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx - w * 0.08, cy - h * 0.1, w * 0.08, h * 0.06, -0.3, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx - w * 0.04, cy + h * 0.06, w * 0.07, h * 0.05, 0.8, 0, Math.PI * 2); ctx.stroke();
      // Right petals (faint - partner fills)
      ctx.globalAlpha = 0.03;
      ctx.beginPath(); ctx.ellipse(cx + w * 0.1, cy, w * 0.1, h * 0.07, -0.4, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx + w * 0.08, cy - h * 0.1, w * 0.08, h * 0.06, 0.3, 0, Math.PI * 2); ctx.stroke();
      // Leaves
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#27ae60';
      ctx.beginPath(); ctx.ellipse(cx - w * 0.08, cy + h * 0.32, w * 0.07, h * 0.03, -0.5, 0, Math.PI * 2); ctx.stroke();
    }
  },

  // ── CUTE ──────────────────────────────────────────────────────
  {
    id: 'teddy', label: 'Teddy Bear', category: 'Cute', emoji: '🧸',
    color: '#f9ca24',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h * 0.42;
      const r = Math.min(w, h) * 0.16;
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 2.5;
      // Body
      ctx.beginPath(); ctx.ellipse(cx, cy + r * 1.2, r * 0.85, r, 0, 0, Math.PI * 2); ctx.stroke();
      // Head
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      // Ears
      ctx.beginPath(); ctx.arc(cx - r * 0.7, cy - r * 0.75, r * 0.36, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + r * 0.7, cy - r * 0.75, r * 0.36, 0, Math.PI * 2); ctx.stroke();
      // Eyes
      ctx.beginPath(); ctx.arc(cx - r * 0.32, cy - r * 0.15, r * 0.08, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + r * 0.32, cy - r * 0.15, r * 0.08, 0, Math.PI * 2); ctx.fill();
      // Nose snout
      ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.22, r * 0.28, r * 0.18, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy + r * 0.2, r * 0.06, 0, Math.PI * 2); ctx.fill();
      // Arms + legs
      ctx.beginPath(); ctx.ellipse(cx - r * 1.05, cy + r * 1.1, r * 0.22, r * 0.55, 0.3, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx + r * 1.05, cy + r * 1.1, r * 0.22, r * 0.55, -0.3, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx - r * 0.5, cy + r * 2.05, r * 0.38, r * 0.22, 0.2, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx + r * 0.5, cy + r * 2.05, r * 0.38, r * 0.22, -0.2, 0, Math.PI * 2); ctx.stroke();
    }
  },
  {
    id: 'love-letter', label: 'Love Letter', category: 'Cute', emoji: '💌',
    color: '#fd79a8',
    draw: (ctx, w, h) => {
      const lx = w * 0.15, rx = w * 0.85, ty = h * 0.2, by = h * 0.75;
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#fd79a8'; ctx.lineWidth = 2.5;
      // Envelope body
      ctx.beginPath(); ctx.rect(lx, ty, rx - lx, by - ty); ctx.stroke();
      // Envelope flap (V shape)
      ctx.beginPath(); ctx.moveTo(lx, ty); ctx.lineTo(w / 2, h * 0.46); ctx.lineTo(rx, ty); ctx.stroke();
      // Bottom fold lines
      ctx.beginPath(); ctx.moveTo(lx, by); ctx.lineTo(w / 2, h * 0.55); ctx.lineTo(rx, by); ctx.stroke();
      // Heart on seal
      const hx = w / 2, hy = h * 0.5, hr = h * 0.036;
      ctx.beginPath();
      ctx.moveTo(hx, hy + hr * 0.9);
      ctx.bezierCurveTo(hx - hr * 2, hy - hr * 0.5, hx - hr * 2, hy - hr * 2, hx, hy - hr * 0.68);
      ctx.bezierCurveTo(hx + hr * 2, hy - hr * 2, hx + hr * 2, hy - hr * 0.5, hx, hy + hr * 0.9);
      ctx.stroke();
    }
  },
  {
    id: 'polaroid', label: 'Polaroid Frame', category: 'Cute', emoji: '📸',
    color: '#74b9ff',
    draw: (ctx, w, h) => {
      const lx = w * 0.18, rx = w * 0.82, ty = h * 0.14, by = h * 0.82;
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#74b9ff'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.rect(lx, ty, rx - lx, by - ty); ctx.stroke();
      // Photo area (inner)
      ctx.beginPath(); ctx.rect(lx + w * 0.04, ty + h * 0.04, (rx - lx) - w * 0.08, (by - ty) * 0.72); ctx.stroke();
      // Caption line area
      ctx.beginPath(); ctx.moveTo(lx + w * 0.1, by - h * 0.1); ctx.lineTo(rx - w * 0.1, by - h * 0.1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(lx + w * 0.14, by - h * 0.06); ctx.lineTo(rx - w * 0.14, by - h * 0.06); ctx.stroke();
      // Heart watermark inside
      const hx = w / 2, hy = ty + (by - ty) * 0.78 * 0.5, hr = h * 0.04;
      ctx.beginPath();
      ctx.moveTo(hx, hy + hr); ctx.bezierCurveTo(hx - hr * 2, hy - hr * 0.5, hx - hr * 2, hy - hr * 2, hx, hy - hr * 0.7);
      ctx.bezierCurveTo(hx + hr * 2, hy - hr * 2, hx + hr * 2, hy - hr * 0.5, hx, hy + hr); ctx.stroke();
    }
  },
  {
    id: 'cloud-moon', label: 'Cloud & Moon', category: 'Cute', emoji: '🌙',
    color: '#a29bfe',
    draw: (ctx, w, h) => {
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#a29bfe'; ctx.lineWidth = 2.5;
      // Moon crescent
      ctx.beginPath(); ctx.arc(w * 0.72, h * 0.22, h * 0.14, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(w * 0.8, h * 0.18, h * 0.1, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill();
      // Stars
      [[0.22, 0.18], [0.5, 0.12], [0.6, 0.28], [0.3, 0.32]].forEach(([sx, sy]) => {
        const s = h * 0.015;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const x = w * sx + Math.cos(a) * s, y = h * sy + Math.sin(a) * s;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.strokeStyle = '#fdcb6e'; ctx.stroke();
      });
      // Cloud
      ctx.strokeStyle = '#a29bfe';
      ctx.beginPath();
      ctx.arc(w * 0.3, h * 0.62, h * 0.07, 0, Math.PI * 2);
      ctx.arc(w * 0.42, h * 0.58, h * 0.09, 0, Math.PI * 2);
      ctx.arc(w * 0.54, h * 0.61, h * 0.075, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w * 0.18, h * 0.68); ctx.lineTo(w * 0.62, h * 0.68); ctx.stroke();
    }
  },
  {
    id: 'minimal-faces', label: 'Facing Each Other', category: 'Cute', emoji: '👫',
    color: '#fd79a8',
    draw: (ctx, w, h) => {
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#fd79a8'; ctx.lineWidth = 2.5;
      const fy = h * 0.32;
      // Left face outline (profile)
      ctx.beginPath(); ctx.arc(w * 0.3, fy, h * 0.1, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w * 0.3, fy + h * 0.1); ctx.bezierCurveTo(w * 0.26, fy + h * 0.2, w * 0.24, fy + h * 0.3, w * 0.28, fy + h * 0.38); ctx.stroke();
      // Eyes / features minimal lines
      ctx.beginPath(); ctx.arc(w * 0.32, fy - h * 0.02, h * 0.012, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(w * 0.27, fy - h * 0.02, h * 0.01, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(w * 0.27, fy + h * 0.04); ctx.quadraticCurveTo(w * 0.3, fy + h * 0.07, w * 0.33, fy + h * 0.04); ctx.stroke();
      // Right face (faint guide for partner)
      ctx.globalAlpha = 0.035;
      ctx.beginPath(); ctx.arc(w * 0.7, fy, h * 0.1, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w * 0.7, fy + h * 0.1); ctx.bezierCurveTo(w * 0.74, fy + h * 0.2, w * 0.76, fy + h * 0.3, w * 0.72, fy + h * 0.38); ctx.stroke();
      // Connecting line / heart between them
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#e84393';
      const hx = w * 0.5, hy = fy, hr = h * 0.032;
      ctx.beginPath();
      ctx.moveTo(hx, hy + hr); ctx.bezierCurveTo(hx - hr * 2, hy - hr * 0.5, hx - hr * 2, hy - hr * 2, hx, hy - hr * 0.7);
      ctx.bezierCurveTo(hx + hr * 2, hy - hr * 2, hx + hr * 2, hy - hr * 0.5, hx, hy + hr); ctx.stroke();
    }
  },

  // ── TRENDY ────────────────────────────────────────────────────
  {
    id: 'neon-love', label: 'Neon Love Sign', category: 'Trendy', emoji: '💡',
    color: '#ff6b81',
    draw: (ctx, w, h) => {
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#ff6b81'; ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      // Draw "Love" in block letters outline
      // L
      ctx.beginPath(); ctx.moveTo(w*0.1,h*0.28); ctx.lineTo(w*0.1,h*0.6); ctx.lineTo(w*0.2,h*0.6); ctx.stroke();
      // O
      ctx.beginPath(); ctx.ellipse(w*0.3,h*0.44,w*0.07,h*0.16,0,0,Math.PI*2); ctx.stroke();
      // V
      ctx.beginPath(); ctx.moveTo(w*0.4,h*0.28); ctx.lineTo(w*0.47,h*0.6); ctx.lineTo(w*0.54,h*0.28); ctx.stroke();
      // E
      ctx.beginPath(); ctx.moveTo(w*0.65,h*0.28); ctx.lineTo(w*0.58,h*0.28); ctx.lineTo(w*0.58,h*0.6); ctx.lineTo(w*0.65,h*0.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w*0.58,h*0.44); ctx.lineTo(w*0.64,h*0.44); ctx.stroke();
      // Glow dots
      ctx.globalAlpha = 0.05;
      [[0.1,0.28],[0.1,0.6],[0.2,0.6],[0.23,0.28],[0.37,0.44],[0.65,0.6]].forEach(([dx,dy]) => {
        ctx.beginPath(); ctx.arc(w*dx,h*dy,h*0.022,0,Math.PI*2); ctx.fillStyle='#ff6b81'; ctx.fill();
      });
    }
  },
  {
    id: 'spotify-card', label: '"Our Song" Card', category: 'Trendy', emoji: '🎵',
    color: '#1db954',
    draw: (ctx, w, h) => {
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#1db954'; ctx.lineWidth = 2.5;
      // Card
      const roundRect = (x, y, rw, rh, rad) => {
        ctx.beginPath();
        ctx.moveTo(x + rad, y);
        ctx.lineTo(x + rw - rad, y); ctx.arcTo(x + rw, y, x + rw, y + rad, rad);
        ctx.lineTo(x + rw, y + rh - rad); ctx.arcTo(x + rw, y + rh, x + rw - rad, y + rh, rad);
        ctx.lineTo(x + rad, y + rh); ctx.arcTo(x, y + rh, x, y + rh - rad, rad);
        ctx.lineTo(x, y + rad); ctx.arcTo(x, y, x + rad, y, rad);
        ctx.closePath(); ctx.stroke();
      };
      roundRect(w*0.1, h*0.15, w*0.8, h*0.65, 20);
      // Album art square
      roundRect(w*0.16, h*0.24, w*0.24, h*0.26, 8);
      // Waveform bars
      for (let i = 0; i < 10; i++) {
        const barH = h * (0.06 + Math.sin(i * 0.9) * 0.04);
        ctx.beginPath(); ctx.moveTo(w*0.44 + i*(w*0.042), h*0.38 + (h*0.06 - barH)/2);
        ctx.lineTo(w*0.44 + i*(w*0.042), h*0.38 + (h*0.06 - barH)/2 + barH); ctx.stroke();
      }
      // Music note
      ctx.beginPath();
      ctx.arc(w*0.78, h*0.32, h*0.028, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w*0.795, h*0.294); ctx.lineTo(w*0.795, h*0.24); ctx.lineTo(w*0.83, h*0.228); ctx.lineTo(w*0.83, h*0.272); ctx.stroke();
      // "♡ text lines" 
      ctx.beginPath(); ctx.moveTo(w*0.16, h*0.6); ctx.lineTo(w*0.58, h*0.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w*0.16, h*0.66); ctx.lineTo(w*0.46, h*0.66); ctx.stroke();
    }
  },
  {
    id: 'chat-bubble', label: 'Chat Bubbles', category: 'Trendy', emoji: '💬',
    color: '#74b9ff',
    draw: (ctx, w, h) => {
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#74b9ff'; ctx.lineWidth = 2.5;
      // Left bubble (you)
      ctx.beginPath();
      ctx.moveTo(w*0.12, h*0.22); ctx.lineTo(w*0.12, h*0.42);
      ctx.arcTo(w*0.12, h*0.48, w*0.18, h*0.48, h*0.04);
      ctx.lineTo(w*0.22, h*0.48); ctx.lineTo(w*0.18, h*0.56); ctx.lineTo(w*0.28, h*0.48);
      ctx.lineTo(w*0.58, h*0.48); ctx.arcTo(w*0.64, h*0.48, w*0.64, h*0.42, h*0.04);
      ctx.lineTo(w*0.64, h*0.22); ctx.arcTo(w*0.64, h*0.16, w*0.58, h*0.16, h*0.04);
      ctx.lineTo(w*0.18, h*0.16); ctx.arcTo(w*0.12, h*0.16, w*0.12, h*0.22, h*0.04);
      ctx.closePath(); ctx.stroke();
      // Text lines
      ctx.beginPath(); ctx.moveTo(w*0.2, h*0.28); ctx.lineTo(w*0.56, h*0.28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w*0.2, h*0.35); ctx.lineTo(w*0.46, h*0.35); ctx.stroke();
      // Right bubble (partner)
      ctx.strokeStyle = '#fd79a8';
      ctx.beginPath();
      ctx.moveTo(w*0.38, h*0.54); ctx.lineTo(w*0.38, h*0.72);
      ctx.arcTo(w*0.38, h*0.78, w*0.44, h*0.78, h*0.04);
      ctx.lineTo(w*0.72, h*0.78); ctx.lineTo(w*0.78, h*0.86); ctx.lineTo(w*0.74, h*0.78);
      ctx.lineTo(w*0.82, h*0.78); ctx.arcTo(w*0.88, h*0.78, w*0.88, h*0.72, h*0.04);
      ctx.lineTo(w*0.88, h*0.54); ctx.arcTo(w*0.88, h*0.48, w*0.82, h*0.48, h*0.04);
      ctx.lineTo(w*0.44, h*0.48); ctx.arcTo(w*0.38, h*0.48, w*0.38, h*0.54, h*0.04);
      ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w*0.46, h*0.6); ctx.lineTo(w*0.8, h*0.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w*0.46, h*0.67); ctx.lineTo(w*0.68, h*0.67); ctx.stroke();
    }
  },
  {
    id: 'minimal-couple', label: 'Line Art Couple', category: 'Trendy', emoji: '✍️',
    color: '#2d3436',
    draw: (ctx, w, h) => {
      ctx.globalAlpha = 0.07; ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 2;
      // Single continuous line art - abstract couple
      ctx.beginPath();
      ctx.moveTo(w*0.28, h*0.18);
      ctx.bezierCurveTo(w*0.18, h*0.18, w*0.14, h*0.3, w*0.22, h*0.36);
      ctx.bezierCurveTo(w*0.3, h*0.42, w*0.36, h*0.38, w*0.36, h*0.44);
      ctx.bezierCurveTo(w*0.36, h*0.5, w*0.32, h*0.52, w*0.28, h*0.52);
      ctx.bezierCurveTo(w*0.18, h*0.52, w*0.14, h*0.6, w*0.2, h*0.68);
      ctx.bezierCurveTo(w*0.26, h*0.76, w*0.4, h*0.78, w*0.42, h*0.86);
      ctx.stroke();
      // Second person
      ctx.beginPath();
      ctx.moveTo(w*0.72, h*0.18);
      ctx.bezierCurveTo(w*0.82, h*0.18, w*0.86, h*0.3, w*0.78, h*0.36);
      ctx.bezierCurveTo(w*0.7, h*0.42, w*0.64, h*0.38, w*0.64, h*0.44);
      ctx.bezierCurveTo(w*0.64, h*0.5, w*0.68, h*0.52, w*0.72, h*0.52);
      ctx.bezierCurveTo(w*0.82, h*0.52, w*0.86, h*0.6, w*0.8, h*0.68);
      ctx.bezierCurveTo(w*0.74, h*0.76, w*0.6, h*0.78, w*0.58, h*0.86);
      ctx.stroke();
      // Connecting element (intertwined)
      ctx.strokeStyle = '#e84393';
      ctx.beginPath(); ctx.moveTo(w*0.38, h*0.44); ctx.bezierCurveTo(w*0.5, h*0.36, w*0.5, h*0.52, w*0.62, h*0.44); ctx.stroke();
    }
  },
];

// Generate 6-char session code
const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// ═══════════════════════════════════════════════════════════════════
//  COLOR PICKER COMPONENT
// ═══════════════════════════════════════════════════════════════════
function hsvToHex(h, s, v) {
  let r, g, b;
  const i = Math.floor(h * 6), f = h * 6 - i;
  const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r=v;g=t;b=p; break; case 1: r=q;g=v;b=p; break;
    case 2: r=p;g=v;b=t; break; case 3: r=p;g=q;b=v; break;
    case 4: r=t;g=p;b=v; break; case 5: r=v;g=p;b=q; break;
  }
  return '#' + [r,g,b].map(x => Math.round(x*255).toString(16).padStart(2,'0')).join('');
}

function ColorPicker({ color, onChange, onClose }) {
  const specRef = useRef(null);
  const [hue, setHue] = useState(0);
  const [sv, setSv] = useState({ s: 0.8, v: 0.9 });
  const [tab, setTab] = useState('spectrum');
  const quickColors = ['#ff6b81','#ff4757','#ffa502','#ffd700','#2ecc71','#00b894','#74b9ff','#0984e3','#a29bfe','#6c5ce7','#fd79a8','#e84393','#000000','#636e72','#ffffff'];

  useEffect(() => {
    const c = specRef.current; if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;
    const gh = ctx.createLinearGradient(0,0,W,0);
    gh.addColorStop(0,'#fff'); gh.addColorStop(1,hsvToHex(hue/360,1,1));
    ctx.fillStyle = gh; ctx.fillRect(0,0,W,H);
    const gv = ctx.createLinearGradient(0,0,0,H);
    gv.addColorStop(0,'rgba(0,0,0,0)'); gv.addColorStop(1,'#000');
    ctx.fillStyle = gv; ctx.fillRect(0,0,W,H);
  }, [hue]);

  const pickSpec = useCallback((e) => {
    const c = specRef.current; if (!c) return;
    const r = c.getBoundingClientRect();
    const s = Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
    const v = Math.max(0,Math.min(1,1-(e.clientY-r.top)/r.height));
    setSv({s,v}); onChange(hsvToHex(hue/360,s,v));
  }, [hue, onChange]);

  const pickHue = useCallback((e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const h2 = Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*360);
    setHue(h2); onChange(hsvToHex(h2/360,sv.s,sv.v));
  }, [sv, onChange]);

  return (
    <div className="ld3-cp" onClick={e=>e.stopPropagation()}>
      <div className="ld3-cp-head">
        <span className="ld3-cp-title">Colours</span>
        <button className="ld3-cp-close" onClick={onClose}>✕</button>
      </div>
      <div className="ld3-cp-tabs">
        {['spectrum','grid'].map(t => (
          <button key={t} className={`ld3-cp-tab${tab===t?' active':''}`} onClick={()=>setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>
      {tab==='spectrum' && (<>
        <div className="ld3-cp-spec-wrap">
          <canvas ref={specRef} width={256} height={150} className="ld3-cp-spec"
            onMouseDown={e=>{pickSpec(e);const up=()=>document.removeEventListener('mousemove',pickSpec);document.addEventListener('mousemove',pickSpec);document.addEventListener('mouseup',up,{once:true});}}
          />
          <div className="ld3-cp-thumb" style={{left:`${sv.s*100}%`,top:`${(1-sv.v)*100}%`}}/>
        </div>
        <div className="ld3-cp-hue"
          onMouseDown={e=>{pickHue(e);const up=()=>document.removeEventListener('mousemove',pickHue);document.addEventListener('mousemove',pickHue);document.addEventListener('mouseup',up,{once:true});}}
        >
          <div className="ld3-cp-hue-thumb" style={{left:`${(hue/360)*100}%`}}/>
        </div>
      </>)}
      {tab==='grid' && (
        <div className="ld3-cp-grid">
          {Array.from({length:96},(_,i)=>{
            const h2=(i%12)/12, v2=1-Math.floor(i/12)/7;
            const hex = hsvToHex(h2, 0.9, v2);
            return <div key={i} className="ld3-cp-gcell" style={{background:hex}} onClick={()=>onChange(hex)}/>;
          })}
        </div>
      )}
      <div className="ld3-cp-quick">
        <div className="ld3-cp-preview" style={{background:color}}/>
        <div className="ld3-cp-swatches">
          {quickColors.map(c=>(
            <div key={c} className={`ld3-cp-sw${color===c?' active':''}`}
              style={{background:c,border:c==='#ffffff'?'1.5px solid #ddd':undefined}}
              onClick={()=>onChange(c)}/>
          ))}
        </div>
      </div>
      <div className="ld3-cp-hex">
        <span className="ld3-cp-hex-hash">#</span>
        <input className="ld3-cp-hex-in" maxLength={6}
          value={color.replace('#','')}
          onChange={e=>{const v='#'+e.target.value;if(/^#[0-9a-f]{6}$/i.test(v))onChange(v);}}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  TEMPLATE THUMBNAIL (renders preview canvas)
// ═══════════════════════════════════════════════════════════════════
function TemplateThumbnail({ template, selected, onClick }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle = '#fff8f9'; ctx.fillRect(0,0,c.width,c.height);
    ctx.save();
    template.draw(ctx, c.width, c.height);
    ctx.restore();
  }, [template]);

  return (
    <button className={`ld3-tmpl-item${selected?' selected':''}`} onClick={onClick}>
      <canvas ref={ref} width={100} height={80} className="ld3-tmpl-canvas"/>
      <span className="ld3-tmpl-label">{template.label}</span>
      {selected && <div className="ld3-tmpl-check">✓</div>}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
const BRUSH_SIZES = [2,4,8,14,24,36];
const REACTIONS = ['❤️','😂','🥰','🔥','✨','💕'];
const TIMERS = [30,60,120];

export default function LoveDraw() {
  const { currentUser, userData } = useAuth();
  const db = rtdb;

  // Refs
  const canvasRef  = useRef(null);
  const containerRef = useRef(null);
  const drawingRef   = useRef(false);
  const lastPt       = useRef(null);
  const pending      = useRef([]);
  const flushTmr     = useRef(null);
  const timerIntv    = useRef(null);
  const myProcessed  = useRef(new Set());

  // State
  const [phase, setPhase] = useState('lobby'); // lobby|templates|draw|merged
  const [sessionId, setSessionId]   = useState('');
  const [joinInput,  setJoinInput]  = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [mySide, setMySide]         = useState('creator'); // or 'joiner'
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [partnerName,   setPartnerName]   = useState('Partner');
  const [partnerCursor, setPartnerCursor] = useState(null);
  const [partnerColor,  setPartnerColor]  = useState('#b57bee');
  const [templateCat,   setTemplateCat]   = useState('Romantic');
  const [selectedTmpl,  setSelectedTmpl]  = useState(null);
  const [color,     setColor]    = useState('#ff6b81');
  const [brushSize, setBrushSize] = useState(6);
  const [erasing,   setErasing]  = useState(false);
  const [fillMode,  setFillMode] = useState(false);
  const [showCP,    setShowCP]   = useState(false);
  const [showBP,    setShowBP]   = useState(false);
  const [timerDur,  setTimerDur] = useState(60);
  const [timeLeft,  setTimeLeft] = useState(null);
  const [timerOn,   setTimerOn]  = useState(false);
  const [canvasSize,setCanvasSize] = useState({w:900,h:560});
  const [mergedImg, setMergedImg] = useState(null);
  const [history,   setHistory]  = useState([]);
  const [reactions, setReactions] = useState([]);
  const [flyEmoji,  setFlyEmoji] = useState(null);
  const [toast,     setToast]    = useState('');
  const [copied,    setCopied]   = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  const coupleId = userData?.coupleId || userData?.connectionCode || 'demo';
  const myName   = userData?.name || 'You';
  const myUid    = currentUser?.uid || 'guest-' + Math.random().toString(36).slice(2,6);

  // Canvas size
  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setCanvasSize({ w: Math.floor(r.width), h: Math.floor(r.height) });
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [phase]);

  // Init canvas with white + guide when entering draw phase
  useEffect(() => {
    if (phase !== 'draw') return;
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fffaf9'; ctx.fillRect(0,0,c.width,c.height);
    if (selectedTmpl) {
      const tmpl = TEMPLATES.find(t => t.id === selectedTmpl);
      if (tmpl) { ctx.save(); tmpl.draw(ctx, c.width, c.height); ctx.restore(); }
    }
    setHistory([c.toDataURL()]);
  }, [phase, canvasSize, selectedTmpl]);

  // ── Session management ──────────────────────────────────────
  const createSession = () => {
    const code = generateCode();
    setGeneratedCode(code);
    initSession(code, 'creator');
  };

  const joinSession = () => {
    const code = joinInput.trim().toUpperCase();
    if (!code) return;
    initSession(code, 'joiner');
  };

  const initSession = (sid, role) => {
    setSessionId(sid);
    setMySide(role);

    const presRef = ref(db, `ld3/${sid}/presence/${myUid}`);
    set(presRef, { name: myName, online: true, role, color, ts: Date.now() });
    onDisconnect(presRef).remove();

    onValue(ref(db, `ld3/${sid}/presence`), snap => {
      const data = snap.val() || {};
      const others = Object.entries(data).filter(([k]) => k !== myUid);
      setPartnerOnline(others.length > 0);
      if (others.length > 0) {
        setPartnerName(others[0][1]?.name || 'Partner');
        setPartnerColor(others[0][1]?.color || '#b57bee');
      }
    });

    onValue(ref(db, `ld3/${sid}/strokes`), snap => {
      const data = snap.val(); if (!data) return;
      Object.entries(data).forEach(([key, stroke]) => {
        if (stroke.uid === myUid || myProcessed.current.has(key)) return;
        myProcessed.current.add(key);
        replayStroke(stroke);
      });
    });

    onValue(ref(db, `ld3/${sid}/cursors`), snap => {
      const data = snap.val() || {};
      const p = Object.entries(data).find(([k]) => k !== myUid);
      setPartnerCursor(p ? p[1] : null);
    });

    onValue(ref(db, `ld3/${sid}/reactions`), snap => {
      if (snap.val()) setReactions(Object.values(snap.val()).slice(-6));
    });

    onValue(ref(db, `ld3/${sid}/merge`), snap => {
      if (snap.val() === true) doMerge();
    });

    onValue(ref(db, `ld3/${sid}/template`), snap => {
      if (snap.val()) setSelectedTmpl(snap.val());
    });

    setPhase('templates');
  };

  const leaveSession = () => {
    if (sessionId) remove(ref(db, `ld3/${sessionId}/presence/${myUid}`));
    setPhase('lobby');
    setSessionId('');
    setGeneratedCode('');
    setMergedImg(null);
    setTimeLeft(null);
    setTimerOn(false);
    clearInterval(timerIntv.current);
    myProcessed.current.clear();
    setStrokeCount(0);
  };

  // ── Template selection ───────────────────────────────────────
  const confirmTemplate = () => {
    if (sessionId && selectedTmpl) {
      set(ref(db, `ld3/${sessionId}/template`), selectedTmpl);
    }
    setPhase('draw');
  };

  // ── Drawing ──────────────────────────────────────────────────
  const replayStroke = (stroke) => {
    const c = canvasRef.current; if (!c || !stroke.points?.length) return;
    const ctx = c.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = stroke.erasing ? 'destination-out' : 'source-over';
    ctx.strokeStyle = stroke.erasing ? 'rgba(0,0,0,1)' : stroke.color;
    ctx.lineWidth = stroke.size;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    stroke.points.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
    ctx.stroke(); ctx.restore();
  };

  const flushStroke = useCallback(() => {
    if (!sessionId || pending.current.length < 2) return;
    const r2 = push(ref(db, `ld3/${sessionId}/strokes`));
    myProcessed.current.add(r2.key);
    set(r2, { uid:myUid, color, size:brushSize, erasing, points:pending.current, ts:Date.now() });
    pending.current = [];
    setStrokeCount(n => n+1);
    if (sessionId) set(ref(db,`ld3/${sessionId}/presence/${myUid}/color`), color);
  }, [sessionId, myUid, color, brushSize, erasing]);

  const getPos = (e, c) => {
    const r = c.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - r.left) * (c.width / r.width),
      y: (src.clientY - r.top)  * (c.height / r.height),
    };
  };

  const startDraw = useCallback((e) => {
    if (phase !== 'draw') return;
    e.preventDefault();
    const c = canvasRef.current; if (!c) return;
    const pos = getPos(e, c);
    drawingRef.current = true;
    lastPt.current = pos;
    pending.current = [pos];
    const ctx = c.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
    ctx.fillStyle = erasing ? 'rgba(0,0,0,1)' : color;
    ctx.beginPath(); ctx.arc(pos.x, pos.y, brushSize/2, 0, Math.PI*2);
    if (!erasing) ctx.fill();
    ctx.restore();
  }, [phase, erasing, color, brushSize]);

  const continueDraw = useCallback((e) => {
    if (!drawingRef.current || phase !== 'draw') return;
    e.preventDefault();
    const c = canvasRef.current; if (!c) return;
    const pos = getPos(e, c);
    const last = lastPt.current; if (!last) return;
    const ctx = c.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
    ctx.strokeStyle = erasing ? 'rgba(0,0,0,1)' : color;
    ctx.lineWidth = brushSize; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(pos.x, pos.y); ctx.stroke();
    ctx.restore();
    lastPt.current = pos;
    pending.current.push(pos);
    clearTimeout(flushTmr.current);
    flushTmr.current = setTimeout(flushStroke, 60);
    if (sessionId) set(ref(db,`ld3/${sessionId}/cursors/${myUid}`),{x:pos.x/c.width,y:pos.y/c.height,name:myName,color});
  }, [phase, erasing, color, brushSize, flushStroke, sessionId, myUid, myName]);

  const endDraw = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    flushStroke();
    const c = canvasRef.current;
    if (c) setHistory(h => [...h.slice(-9), c.toDataURL()]);
  }, [flushStroke]);

  const undo = () => {
    if (history.length < 2) return;
    const stack = history.slice(0,-1);
    setHistory(stack);
    const c = canvasRef.current; if (!c) return;
    const img = new Image();
    img.onload = () => c.getContext('2d').drawImage(img, 0, 0);
    img.src = stack[stack.length-1];
  };

  const clearCanvas = () => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fffaf9'; ctx.fillRect(0,0,c.width,c.height);
    if (selectedTmpl) {
      const t = TEMPLATES.find(t=>t.id===selectedTmpl);
      if (t) { ctx.save(); t.draw(ctx,c.width,c.height); ctx.restore(); }
    }
  };

  // ── Timer ────────────────────────────────────────────────────
  const startTimer = () => {
    setTimeLeft(timerDur); setTimerOn(true);
    clearInterval(timerIntv.current);
    timerIntv.current = setInterval(() => {
      setTimeLeft(p => { if (p<=1) { clearInterval(timerIntv.current); setTimerOn(false); handleMerge(); return 0; } return p-1; });
    }, 1000);
  };

  // ── Merge ────────────────────────────────────────────────────
  const handleMerge = () => {
    if (sessionId) set(ref(db,`ld3/${sessionId}/merge`), true);
    doMerge();
  };
  const doMerge = () => {
    const c = canvasRef.current; if (!c) return;
    setMergedImg(c.toDataURL('image/png'));
    setPhase('merged');
  };

  // ── Reactions ────────────────────────────────────────────────
  const sendReaction = (emoji) => {
    setFlyEmoji({emoji, id:Date.now()});
    setTimeout(() => setFlyEmoji(null), 1600);
    if (sessionId) {
      const rr = push(ref(db,`ld3/${sessionId}/reactions`));
      set(rr, {emoji, name:myName, ts:Date.now()});
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(sessionId || generatedCode);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const saveImage = () => {
    if (!mergedImg) return;
    const a = document.createElement('a');
    a.href = mergedImg; a.download = `lovedraw-${Date.now()}.png`; a.click();
    setToast('💾 Your drawing is saved!');
    setTimeout(() => setToast(''), 2500);
  };

  const filteredTemplates = useMemo(() => TEMPLATES.filter(t => t.category === templateCat), [templateCat]);

  // ══════════════════════════════════════════════════════════════
  //  LOBBY
  // ══════════════════════════════════════════════════════════════
  if (phase === 'lobby') {
    return (
      <div className="ld3-lobby">
        <div className="ld3-lobby-bg-art" aria-hidden="true">
          <div className="ld3-orb ld3-orb1"/>
          <div className="ld3-orb ld3-orb2"/>
          <div className="ld3-orb ld3-orb3"/>
        </div>

        <div className="ld3-lobby-card">
          <div className="ld3-lobby-icon">🎨</div>
          <h1 className="ld3-lobby-title">Love Draw</h1>
          <p className="ld3-lobby-sub">
            One canvas, two hearts — draw together in real-time ✨
          </p>

          <div className="ld3-lobby-cols">
            {/* CREATE SESSION */}
            <div className="ld3-lobby-col create">
              <div className="ld3-lobby-col-icon">✏️</div>
              <h3 className="ld3-lobby-col-title">Create Session</h3>
              <p className="ld3-lobby-col-desc">Generate a code and share it with your partner</p>

              {!generatedCode ? (
                <button className="ld3-btn primary full" onClick={createSession}>
                  Generate Code 💗
                </button>
              ) : (
                <div className="ld3-code-display">
                  <div className="ld3-code-label">Your Session Code</div>
                  <div className="ld3-code-value">{generatedCode}</div>
                  <button className="ld3-code-copy" onClick={copyCode}>
                    {copied ? '✓ Copied!' : '📋 Copy Code'}
                  </button>
                  <button className="ld3-btn primary full mt" onClick={() => { setSessionId(generatedCode); setPhase('templates'); }}>
                    Start Drawing 🎨
                  </button>
                </div>
              )}
            </div>

            <div className="ld3-lobby-divider">
              <div className="ld3-lobby-divider-line"/>
              <span className="ld3-lobby-divider-or">OR</span>
              <div className="ld3-lobby-divider-line"/>
            </div>

            {/* JOIN SESSION */}
            <div className="ld3-lobby-col join">
              <div className="ld3-lobby-col-icon">🔗</div>
              <h3 className="ld3-lobby-col-title">Join Session</h3>
              <p className="ld3-lobby-col-desc">Enter your partner's code to join their canvas</p>
              <div className="ld3-join-row">
                <input
                  className="ld3-code-input"
                  placeholder="Enter 6-digit code"
                  value={joinInput}
                  onChange={e => setJoinInput(e.target.value.toUpperCase())}
                  maxLength={6}
                />
                <button className="ld3-btn primary"onClick={joinSession} disabled={!joinInput.trim()}>
                  Join ❤️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  //  TEMPLATE PICKER
  // ══════════════════════════════════════════════════════════════
  if (phase === 'templates') {
    return (
      <div className="ld3-tmpl-screen">
        <div className="ld3-tmpl-header">
          <button className="ld3-icon-btn" onClick={leaveSession}>✕</button>
          <div>
            <h2 className="ld3-tmpl-screen-title">Choose Your Canvas</h2>
            <p className="ld3-tmpl-screen-sub">
              Session <strong>{sessionId}</strong>
              {' · '}
              <span className={`ld3-dot ${partnerOnline ? 'on':'off'}`}/>
              {partnerOnline ? `${partnerName} is online` : 'Waiting for partner…'}
            </p>
          </div>
          <button className="ld3-btn primary" onClick={confirmTemplate} style={{marginLeft:'auto'}}>
            {selectedTmpl ? 'Start Drawing 🎨' : 'Free Draw ✏️'}
          </button>
        </div>

        {/* Category tabs */}
        <div className="ld3-cat-tabs">
          {TEMPLATE_CATEGORIES.map(cat => (
            <button key={cat}
              className={`ld3-cat-tab${templateCat===cat?' active':''}`}
              onClick={() => setTemplateCat(cat)}
            >
              {cat === 'Romantic' ? '💗' : cat === 'Half-Draw' ? '🎭' : cat === 'Cute' ? '🌸' : '✨'} {cat}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="ld3-tmpl-grid-wrap">
          <div className="ld3-tmpl-grid">
            <button
              className={`ld3-tmpl-item no-guide${!selectedTmpl?' selected':''}`}
              onClick={() => setSelectedTmpl(null)}
            >
              <div className="ld3-tmpl-free-icon">✏️</div>
              <span className="ld3-tmpl-label">Free Draw</span>
              {!selectedTmpl && <div className="ld3-tmpl-check">✓</div>}
            </button>
            {filteredTemplates.map(t => (
              <TemplateThumbnail
                key={t.id}
                template={t}
                selected={selectedTmpl === t.id}
                onClick={() => setSelectedTmpl(selectedTmpl === t.id ? null : t.id)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  //  MERGED
  // ══════════════════════════════════════════════════════════════
  if (phase === 'merged' && mergedImg) {
    return (
      <div className="ld3-merged">
        <div className="ld3-merged-floats" aria-hidden>
          {['💗','✨','💕','🌸','💖','⭐','💝','🌺','🎨','🖌️','🥰','🎶'].map((e,i)=>(
            <span key={i} className="ld3-merged-float"
              style={{'--d':`${i*0.3}s`,'--l':`${4+i*7.5}%`}}>
              {e}
            </span>
          ))}
        </div>
        <div className="ld3-merged-card">
          <div className="ld3-merged-pill">💗 Your Love Canvas</div>
          <h2 className="ld3-merged-title">A Masterpiece of Two</h2>
          <p className="ld3-merged-sub">Your hearts, your strokes, one beautiful story 🎨</p>
          <div className="ld3-merged-frame">
            <img src={mergedImg} alt="Your love drawing" className="ld3-merged-img"/>
          </div>
          <div className="ld3-merged-actions">
            <button className="ld3-btn primary" onClick={saveImage}>💾 Save</button>
            <button className="ld3-btn secondary" onClick={()=>{setPhase('draw');setMergedImg(null);}}>🎨 Continue</button>
            <button className="ld3-btn ghost" onClick={leaveSession}>🚪 Leave</button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  //  MAIN DRAW UI
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="ld3-root" onClick={() => { setShowCP(false); setShowBP(false); }}>
      {toast && <div className="ld3-toast">{toast}</div>}
      {flyEmoji && <div key={flyEmoji.id} className="ld3-fly">{flyEmoji.emoji}</div>}

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="ld3-topbar">
        <div className="ld3-topbar-left">
          <button className="ld3-icon-btn" onClick={leaveSession} title="Leave">☰</button>
          <div className="ld3-session-info">
            <span className="ld3-session-code" onClick={copyCode} title="Click to copy">
              {sessionId}
              <span className="ld3-copy-hint">{copied ? '✓' : '📋'}</span>
            </span>
            <span className={`ld3-partner-status${partnerOnline?' on':' off'}`}>
              <span className="ld3-dot"/>
              {partnerOnline ? `${partnerName} is drawing` : 'Waiting for partner…'}
            </span>
          </div>
        </div>

        <div className="ld3-topbar-center">
          {timeLeft !== null && (
            <div className={`ld3-timer${timeLeft<=10?' urgent':''}`}>⏱ {timeLeft}s</div>
          )}
        </div>

        <div className="ld3-topbar-right">
          {!timerOn && timeLeft===null ? (
            <div className="ld3-timer-pick" onClick={e=>e.stopPropagation()}>
              <select className="ld3-sel" value={timerDur} onChange={e=>setTimerDur(+e.target.value)}>
                {TIMERS.map(t=><option key={t} value={t}>{t}s</option>)}
              </select>
              <button className="ld3-icon-btn" onClick={startTimer}>⏱</button>
            </div>
          ) : timerOn ? (
            <button className="ld3-icon-btn" onClick={()=>{clearInterval(timerIntv.current);setTimerOn(false);setTimeLeft(null);}}>✕</button>
          ) : null}
          <button className="ld3-btn merge-btn" onClick={handleMerge}>💗 Merge</button>
        </div>
      </div>

      {/* ── Workspace ─────────────────────────────────────────── */}
      <div className="ld3-workspace">
        {/* Side toolbar */}
        <div className="ld3-sidebar" onClick={e=>e.stopPropagation()}>
          {/* Color */}
          <button className="ld3-color-dot" style={{background:color}}
            onClick={()=>{setShowCP(p=>!p);setShowBP(false);}} title="Colour"/>

          {/* Brush size */}
          <button className="ld3-brush-dot-btn"
            onClick={()=>{setShowBP(p=>!p);setShowCP(false);}} title="Brush size">
            <span className="ld3-brush-preview" style={{width:Math.min(brushSize,20),height:Math.min(brushSize,20),background:color}}/>
          </button>

          <div className="ld3-sb-div"/>

          {/* Pen */}
          <button className={`ld3-tool${!erasing&&!fillMode?' active':''}`}
            onClick={()=>{setErasing(false);setFillMode(false);}} title="Pen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
            </svg>
          </button>

          {/* Eraser */}
          <button className={`ld3-tool${erasing?' active':''}`}
            onClick={()=>{setErasing(p=>!p);setFillMode(false);}} title="Eraser">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 20H7L3 16l13-13 7 7-3 10z"/><path d="M6.5 17.5l4-4"/>
            </svg>
          </button>

          <div className="ld3-sb-div"/>

          {/* Undo */}
          <button className="ld3-tool" onClick={undo} title="Undo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 00-4-4H4"/>
            </svg>
          </button>

          {/* Clear */}
          <button className="ld3-tool" onClick={clearCanvas} title="Clear">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>

          <div className="ld3-sb-div"/>

          {/* Reactions */}
          {REACTIONS.map(r => (
            <button key={r} className="ld3-react" onClick={()=>sendReaction(r)}>{r}</button>
          ))}
        </div>

        {/* Brush panel */}
        {showBP && (
          <div className="ld3-brush-panel" onClick={e=>e.stopPropagation()}>
            <div className="ld3-bp-title">Brush Size</div>
            {BRUSH_SIZES.map(s => (
              <button key={s} className={`ld3-bp-opt${brushSize===s?' active':''}`}
                onClick={()=>{setBrushSize(s);setShowBP(false);}}>
                <div className="ld3-bp-dot" style={{width:Math.min(s,30),height:Math.min(s,30),background:color}}/>
              </button>
            ))}
          </div>
        )}

        {/* Color picker */}
        {showCP && (
          <div className="ld3-cp-wrap" onClick={e=>e.stopPropagation()}>
            <ColorPicker color={color} onChange={setColor} onClose={()=>setShowCP(false)}/>
          </div>
        )}

        {/* Canvas */}
        <div className="ld3-canvas-wrap" ref={containerRef}>
          {/* Partner color indicator top-right */}
          {partnerOnline && (
            <div className="ld3-partner-badge">
              <span className="ld3-partner-badge-dot" style={{background:partnerColor}}/>
              {partnerName}
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={canvasSize.w}
            height={canvasSize.h}
            className="ld3-canvas"
            style={{cursor: erasing ? 'cell' : fillMode ? 'crosshair' : 'default', touchAction:'none'}}
            onMouseDown={startDraw}
            onMouseMove={continueDraw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={continueDraw}
            onTouchEnd={endDraw}
          />

          {/* Partner cursor */}
          {partnerCursor && (
            <div className="ld3-p-cursor"
              style={{left:`${partnerCursor.x*100}%`, top:`${partnerCursor.y*100}%`}}>
              <div className="ld3-p-cursor-ring" style={{borderColor:partnerColor,background:`${partnerColor}22`}}/>
              <div className="ld3-p-cursor-name">{partnerCursor.name}</div>
            </div>
          )}
        </div>
      </div>

      {/* Reactions feed */}
      {reactions.length > 0 && (
        <div className="ld3-react-feed">
          {reactions.slice(-4).map((r,i) => (
            <div key={i} className="ld3-react-chip">{r.emoji} <span>{r.name}</span></div>
          ))}
        </div>
      )}
    </div>
  );
}
