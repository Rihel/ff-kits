import plugin from 'tailwindcss/plugin'
/** @type {import('tailwindcss').Config} */
export const defaultTailwindConfig = {
  theme: {
    extend: {
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '20px',
        xl: '24px',
        '2xl': '36px',
      },
      colors: {
        primary: 'var(--primary-color)',
        link: 'var(--link-color)',
        success: 'var(--success-color)',
        warning: 'var(--warning-color)',
        error: 'var(--error-color)',
        light: 'var(--bg-color)',
        dark: 'var(--layout-bg)',
        strong: '#8590A3',
      },
      space: {
        default: 'var(--space)',
      },
      textColor: {
        heading: 'var(--heading-color)',
        default: 'var(--text-color)',
        secondary: 'var(--text-color-secondary)',
        light: 'var(--text-color-light)',
      },

      height: {
        header: 'var(--header-height)',
        'no-header': 'calc(100% - var(--header-height))',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.ellipsis-1': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
        },
        '.ellipsis-2': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.ellipsis-3': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        '.ellipsis-4': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '4',
        },
        '.y-scroll': {
          overflow: 'hidden auto',
        },
        '.x-scroll': {
          overflow: 'auto hidden',
        },
      })
    }),
  ],
}
