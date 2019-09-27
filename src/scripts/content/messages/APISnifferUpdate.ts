import {
  PageStatus,
  APISnifferUpdateEvent,
  MessageContainerStatics,
  APISnifferUpdateMessageContainer,
} from '~/types';
import isObj from '~/utils/isObj';
import validateStatus from '~/utils/validateStatus';

const MessageContainer: MessageContainerStatics<
  APISnifferUpdateEvent, 
  APISnifferUpdateMessageContainer
  > = class Container implements APISnifferUpdateMessageContainer {
    static isTrustworthy = (event: any) => {
      if (
        isObj(event) &&
        isObj(event.detail) && 
        isObj(event.detail.update)
      ) {
        const { 
          status, 
          blogname
        } = event.detail.update;
        
        if (!validateStatus(status)) return false;
        if (!blogname && (status !== PageStatus.NOT_OK_ARCHIVE && status !== PageStatus.UNSUPPORTED)) return false;
        
        return true;
      }
    
      return false;
    }
    
    constructor(private event: APISnifferUpdateEvent) {}
    
    public getStatus = () => this.event.detail.update.status
    
    public getBlogname = () => this.event.detail.update.blogname
} 

export default MessageContainer;
