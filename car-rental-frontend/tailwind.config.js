/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12151B",
          soft: "#1B2029",
          line: "#2A303C",
        },
        mist: {
          DEFAULT: "#F3F4F0",
          card: "#FFFFFF",
          dim: "#E7E6E0",
        },
        amber: {
          DEFAULT: "#FFB238",
          dark: "#E89A1C",
        },
        highway: {
          DEFAULT: "#2FA89E",
          dark: "#1F7F77",
        },
        steel: {
          DEFAULT: "#6B7280",
          light: "#9AA0AC",
        },
      },
      fontFamily: {
        display: ["'Clash Display'", "sans-serif"],
        body: ["'General Sans'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
    },
  },
  plugins: [],
}
