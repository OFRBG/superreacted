import colors from "tailwindcss/colors"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './src/**/*.stories.{js,jsx,ts,tsx}',
    './storybook/*.ts'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

