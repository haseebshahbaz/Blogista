/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D3748', // Dark Blue
        secondary: '#38B2AC', // Teal
        accent: '#F6AD55', // Amber
        background: '#F7FAFC', // Light Gray
        text: '#2D3748', // Dark Gray
      },
    },
  },
  plugins: [],
};
