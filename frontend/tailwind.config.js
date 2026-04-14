/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dgcc1: "#453021", // couleur principale
        dgcc: "#4e3625", // couleur principale
        dgcc2: "#573c29", // variante plus claire
        dgcc3: "#684831", // variante intermédiaire
        dgcc4: "#795439", // variante plus chaude
        dgcc5: "#8b6041", // variante la plus claire

        // nouvelles couleurs ajoutées
        dgcc6: "#9c6c49",
        dgcc7: "#ad7852",
        dgcc8: "#b68563",
        dgcc9: "#be9374",
        dgcc10: "#c6a086",
        dgcc11: "#ceae97",
        dgcc12: "#d6bba8",
        dgcc13: "#dec9ba",
      },
    },
  },
  plugins: [],
};
