/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/pages/**/*.{js,ts,jsx,tsx}",
    "./frontend/components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // Blue
        secondary: "#1e293b", // Slate
        accent: "#10b981", // Green
        danger: "#ef4444", // Red
        warning: "#f59e0b", // Yellow
        light: "#f3f4f6", // Light gray background
        dark: "#111827", // Dark text
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 10px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
