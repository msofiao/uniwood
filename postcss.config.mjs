import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";
import postcssImport from "postcss-import";
import tailwindcss from "tailwindcss";

export const plugins = [
  autoprefixer,
  postcssPresetEnv,
  postcssImport,
  tailwindcss,
];
