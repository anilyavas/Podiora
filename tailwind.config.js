const { Colors, Typography } = require('./constants/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: Colors.background,
        surface: Colors.surface,
        card: Colors.card,
        border: Colors.border,
        accent: Colors.accent,
        'accent-dim': Colors.accentDim,
        gold: Colors.gold,
        text: Colors.text,
        muted: Colors.textMuted,
        dim: Colors.textDim,
        success: Colors.success,
        purple: Colors.purple,
      },
      fontSize: {
        xs: Typography.xs,
        sm: Typography.sm,
        md: Typography.md,
        lg: Typography.lg,
        xl: Typography.xl,
        '2xl': Typography.xxl,
        display: Typography.display,
      },
    },
  },
  plugins: [],
};
