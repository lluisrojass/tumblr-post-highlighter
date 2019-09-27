import { 
  PageStatus 
} from '~/types';

export default (status: any): boolean => PageStatus.OK === status;