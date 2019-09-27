import { 
  resolve 
} from 'path';
import { 
  readFileSync 
} from 'fs';
import getTmpDir from '../utils/getTmpDir';

export default (options) => {
  return {
    resolveId(id) {
      return id === options.id ? id : null;
    },
    load(id) {
      if (id === options.id) {
        const script = resolve(getTmpDir(process.env.NODE_ENV === 'production'), `${id}.js`);
        const file = readFileSync(script, { 
          encoding: 'utf8' 
        });
        
        return {
          code: `export default ${JSON.stringify(file)}`
        };
      }
      return null;
    }    
  }
}
