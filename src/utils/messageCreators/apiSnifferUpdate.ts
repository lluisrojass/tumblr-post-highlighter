import {
  MessageTypes,
  APISnifferUpdate, 
  APISnifferUpdateEvent 
} from '~/types';

export default (update: APISnifferUpdate): APISnifferUpdateEvent => (
  new CustomEvent<{ update: APISnifferUpdate }>(
    MessageTypes.API_SNIFFER_UPDATE, {
      detail: {
        update
      }
    }
  )
);