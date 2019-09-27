import { 
  resolve 
} from 'path';

export default (isProd) => ({
  srcDir: resolve(__dirname, '../../src'),
  outDir: resolve(__dirname, `../../${isProd ? '__dist__' : '__watch__' }/lib`)
});
