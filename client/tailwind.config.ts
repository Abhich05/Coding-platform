import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#02043A',
        'cream': '#FDF4EE',
        'orange': '#F97316',
        'gray-custom': '#4B5563',
        'gray-light': '#6B7280',
      },
    },
  },
  plugins: [],
} satisfies Config;
