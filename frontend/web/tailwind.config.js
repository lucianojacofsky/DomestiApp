module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Vibrante Startup Palette
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
        },
        secondary: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        accent: {
          cyan: '#06b6d4',
          orange: '#f97316',
          pink: '#ec4899',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 15px rgba(0, 0, 0, 0.08)',
        'medium': '0 8px 25px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(168, 85, 247, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: []
};