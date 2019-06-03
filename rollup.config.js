import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';

export default {
  input: "src/text-action-element.js",
  output: {
    file: "dist/text-action-element-bundle.js",
    format: "umd",
    name: "TextActionElement",
  },
  plugins: [resolve(),
    typescript()
  ]
};
