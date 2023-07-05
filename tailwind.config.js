/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: "#f4f4f5",
        lighter: "#fafafa",
        lightest: "#ffffff",

        primary: "#1d4ed8",
      },
    },
  },
};
