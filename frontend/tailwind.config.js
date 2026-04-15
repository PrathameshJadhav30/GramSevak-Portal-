/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
        },
      },
      boxShadow: {
        soft: "0 8px 20px -12px rgba(2, 6, 23, 0.25)",
      },
    },
  },
  plugins: [],
}

