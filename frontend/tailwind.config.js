/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14213D",
          light: "#26365A",
          soft: "#3E4E74",
        },
        parchment: {
          DEFAULT: "#FAF6EE",
          dark: "#F0E9D8",
        },
        gold: {
          DEFAULT: "#B8862B",
          light: "#D9A94A",
          dark: "#8F6720",
        },
        sage: {
          DEFAULT: "#3D6B52",
          light: "#4F8A6B",
        },
        clay: {
          DEFAULT: "#A6452F",
          light: "#C15B41",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(circle at 1px 1px, rgba(20,33,61,0.05) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
