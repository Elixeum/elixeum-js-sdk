/* eslint-disable */
import terser from "@rollup/plugin-terser";
import eslint from "@rollup/plugin-eslint";

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: "src/index.js",
  output: {
    file: isProduction ? 'dist/elx-sdk.min.js' : 'dist/elx-sdk.js',
    format: "umd", // For browser and node
    name: "ElixeumClient",
    sourcemap: !isProduction,
    generatedCode: "es5"
  },
  plugins: [
    isProduction && terser({
      compress: {
        drop_console: false // Needed for logging
      },
      mangle: {
        toplevel: true
      },
    }),
    eslint({
      throwOnError: true,
      throwOnWarning: true,
    })
  ],
};
