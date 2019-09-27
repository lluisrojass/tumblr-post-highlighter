import { 
  MessageTypes,
  ContentScriptUpdate,
  ContentScriptUpdateMessage,
} from '~/types';

export default (update: ContentScriptUpdate): ContentScriptUpdateMessage => ({
  type: MessageTypes.CS_UPDATE,
  update
});
