/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:        '#f37913',
        secondary:      '#E67137',
        'app-text':     '#484848',
        'app-muted':    '#757575',
        'primary-hover':'#D5660B',
      },
      boxShadow: {
        bio:              'var(--bio-descryption-shadow)',
        settings:         'var(--settings-shadow)',
        'theme-box':      'var(--theme-box-shadow)',
        'profile-img':    'var(--profile-img-shadow)',
        'main-container': 'var(--main-container-shadow)',
      },
      keyframes: {
        fade: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to:   { opacity: '1', transform: 'translateY(0)'     },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(15px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
      },
      animation: {
        fade:             'fade 0.3s ease-in-out',
        'fade-in':        'fade-in 0.7s ease-in-out',
        'fade-in-medium': 'fade-in 0.81s ease-in-out',
      },
    },
  },
  plugins: [],
};
