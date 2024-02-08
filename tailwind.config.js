/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./client/routes/**/*.tsx",
    "./client/components/**/*.tsx",
    "./client/*.{tsx,html}",
    "./client/providers/*.tsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
