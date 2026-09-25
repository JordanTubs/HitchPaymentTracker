/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#082B61",
        accent: "#E5292A",
        card: "#F4F6F9",
        appbg: "#EDF1F7",
        ink: "#10233F",
        muted: "#667085",
        success: "#16794A",
        danger: "#C92424",
      },
      boxShadow: {
        ledger: "0 16px 40px rgba(8, 43, 97, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
