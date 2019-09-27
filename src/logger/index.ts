import LoggerFactory from './LoggerFactory';
import { 
  LogLevels 
} from '~/types';

const factory = new LoggerFactory();

export default {
  error: factory.createLogger(LogLevels.ERROR),
  warn: factory.createLogger(LogLevels.WARN),
  log: factory.createLogger(LogLevels.LOG),
  info: factory.createLogger(LogLevels.INFO),
  debug: factory.createLogger(LogLevels.DEBUG)
};
