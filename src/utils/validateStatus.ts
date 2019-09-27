import { 
  PageStatus 
} from '~/types';

export default (status: PageStatus): boolean => {
  for(let key in PageStatus) {
    // https://github.com/microsoft/TypeScript/issues/33123#event-2594515407
    // @ts-ignore 
    if (PageStatus[key] === status) return true;
  }
  return false;
}