import terser from "@rollup/plugin-terser";
import eslint from "@rollup/plugin-eslint";
import process from "node:process";

const isProduction = process.env.NODE_ENV === "production";

const config = {
  input: "src/index.js",
  output: {
    file: isProduction ? "dist/elx-sdk.min.js" : "dist/elx-sdk.js",
    format: "umd", // For browser and node
    name: "ElixeumClient",
    sourcemap: !isProduction,
    generatedCode: "es5",
  },
  plugins: [
    eslint({
      throwOnError: true,
      throwOnWarning: true,
      include: ["src/**/*.js", "examples/**/*.{js,html}"],
      exclude: ["node_modules/**"],
    }),
  ],
};

if (isProduction) {
  console.log("Building for production");

  config.plugins.push(
    terser({
      compress: {
        // eslint-disable-next-line camelcase
        drop_console: false, // Needed for logging
        passes: 3,
      },
      mangle: {
        toplevel: true,
        reserved: ["ElixeumClient"],
      },
      ecma: 5,
      module: false,
    }),
  );
}

export default config;
