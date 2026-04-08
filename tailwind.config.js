/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2274A5",
        card: "#E7DFC6",
        appbg: "#E9F1F7",
        ink: "#131B23",
        muted: "#816C61",
        success: "#2D8A56",
      },
      boxShadow: {
        ledger: "0 18px 45px rgba(19, 27, 35, 0.08)",
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
