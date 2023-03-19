import { 
  resolve 
} from 'path';
import terser from '@rollup/plugin-terser';
import nodeResolver from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import genPaths from '../utils/generatePaths';

const isProd = process.env.NODE_ENV === 'production';
const { 
  srcDir, 
  outDir 
} = genPaths(isProd);

const extensions = ['.ts', '.js'];

const plugins = [
  alias({
    resolve: extensions,
    entries: [
      {
        find: /^~\/(.*)$/,
        replacement: resolve(srcDir, '$1')
      }
    ]
  }),
  babel({
    extensions,
  }),
  nodeResolver({ 
    extensions 
  }),
  commonjs(),
  json(),
  isProd && terser()
];

export default [
  {
    input: resolve(srcDir, './scripts/background/UI/index.ts'),
    plugins,
    output: {
      file: resolve(outDir, './ui.background.bundle.js'),
      format: 'iife',
      exports: 'none'
    }
  },
  {
    input: resolve(srcDir, './scripts/background/Installer/index.ts'),
    plugins,
    output: {
      file: resolve(outDir, './installer.background.bundle.js'),
      format: 'iife',
      exports: 'none'
    }
  }
];
