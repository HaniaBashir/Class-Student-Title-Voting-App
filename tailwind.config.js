/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mist: "#f8fafc",
        accent: {
          50: "#f4f7ff",
          500: "#4f6ef7",
        },
      },
      boxShadow: {
        soft: "0 18px 45px -24px rgba(15, 23, 42, 0.25)",
        card: "0 10px 30px -18px rgba(15, 23, 42, 0.18)",
      },
      backgroundImage: {
        halo:
          "radial-gradient(circle at top, rgba(79, 110, 247, 0.12), transparent 36%), radial-gradient(circle at bottom right, rgba(20, 184, 166, 0.08), transparent 28%)",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
