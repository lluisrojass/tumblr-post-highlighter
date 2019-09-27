import { 
  resolve 
} from 'path';

export default (isProd) => (
  resolve(__dirname, `../../${
    isProd ? '__dist__' : '__watch__'
  }/.tmp`)
);