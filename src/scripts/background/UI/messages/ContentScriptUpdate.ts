import {
  MessageContainerStatics,
  ContentScriptUpdateMessage,
  ContentScriptUpdateMessageContainer
} from '~/types';
import isObj from '~/utils/isObj';
import validateStatus from '~/utils/validateStatus';

const MessageContainer: MessageContainerStatics<
  ContentScriptUpdateMessage, 
  ContentScriptUpdateMessageContainer
> = class Container implements ContentScriptUpdateMessageContainer {
  static isTrustworthy = (message: any) => {
    if (isObj(message) && isObj(message.update))  {
      const {
        status,
        excluded
      } = message.update;
      if (validateStatus(status) && typeof excluded === 'boolean') {
        return true;
      }
    }
    
    return false;
  }
  
  private tabId?: number;
  
  constructor(private message: ContentScriptUpdateMessage) {}

  public registerTabId = (tabId: number) => {
    this.tabId = tabId;
  } 

  public getTabId = () => this.tabId

  public getExcluded = () => this.message.update.excluded

  public getStatus = () => this.message.update.status
}

export default MessageContainer;
