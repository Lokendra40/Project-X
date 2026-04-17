// Global themes config
export const themeConfig = {
  romantic: {
    bg: '#fff5f7',
    primary: '#ff6b81',
    text: '#333'
  },
  light: {
    bg: '#ffffff',
    primary: '#4a90e2',
    text: '#222'
  },
  dark: {
    bg: '#121212',
    primary: '#e91e63',
    text: '#eee'
  }
};

export const applyTheme = (themeName) => {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('theme', themeName);
};
