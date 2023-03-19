import { 
  resolve 
} from 'path';
import { babel } from '@rollup/plugin-babel';
import nodeResolver from '@rollup/plugin-node-resolve';
import commonjs from  '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
import banner2 from 'rollup-plugin-banner2';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import resolveAPISniffer from '../plugins/resolveAPISniffer';
import genPaths from '../utils/generatePaths';
import getTmpDir from '../utils/getTmpDir';
import pkg from '../../package.json';

const isProd = process.env.NODE_ENV === 'production';
const tmp = getTmpDir(isProd);
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
    extensions 
  }),
  postcss({
    extract: false,
    inject: false,
    autoModules: false,
    minimize: true
  }),
  nodeResolver({ 
    extensions 
  }),
  commonjs(),
  json(),
  isProd && terser(),
]

export default [
  {
    input: resolve(srcDir, './scripts/content/scripts/APISniffer/index.ts'),
    plugins: [
      ...plugins,
      banner2(() => `/* Tumblr personal post highlighter ${pkg.version}\nby ${pkg.author}\n${pkg.homepage} */`)
    ],
    output: {
      file: resolve(tmp, './APISniffer.js'),
      format: 'iife',
      exports: 'none'
    }
  },
  {
    input: resolve(srcDir, './scripts/content/index.ts'),
    plugins: [
      resolveAPISniffer({ 
        id: 'APISniffer' 
      }),
      ...plugins
    ],
    output: {
      file: resolve(outDir, './content.bundle.js'),
      format: 'iife',
      exports: 'none'
    }
  }
];