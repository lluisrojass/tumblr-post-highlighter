import { 
  LogLevels 
} from '~/types';
import extPrefix from '~/utils/extPrefix';

type LogFn = (...args: any[]) => void;

class LoggerFactory {
  public createLogger = (level: LogLevels): LogFn => {
    const nativeLogFn = console[level];
    return (...args: any[]) => {
      if (!args.length) return;
      const items: [string, ...any[]] = [
        extPrefix(args[0]), 
        ...args.slice(1)
      ];
      nativeLogFn.apply(null, items);
    }
  }
}

export default LoggerFactory;