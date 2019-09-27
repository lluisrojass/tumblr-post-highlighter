import { 
  Observable 
} from 'rxjs';
import {
  MessageTypes,
  UIContentScriptService,
  ContentScriptUpdateMessage,
  ContentScriptUpdateMessageContainer
} from '~/types';
import isObj from '~/utils/isObj';
import createUIActionClickedMsg from '~/utils/messageCreators/uiActionClicked';
import CSUpdateMessage from '~/scripts/background/UI/messages/ContentScriptUpdate';

export default class ContentScriptService implements UIContentScriptService {
  public listenForUpdates = () => {
    return new Observable<ContentScriptUpdateMessageContainer>((subscriber) => {
      chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender) => {
        if (!isObj(message)) return;
        if (message.type !== MessageTypes.CS_UPDATE) return;
        
        const updateMessage = message as ContentScriptUpdateMessage;
  
        const tabId = sender.tab && sender.tab.id;
        if (typeof tabId !== 'number') return;

        if (!CSUpdateMessage.isTrustworthy(updateMessage)) return;
        
        const updateMessageContainer = new CSUpdateMessage(updateMessage);
        updateMessageContainer.registerTabId(tabId);
        
        subscriber.next(updateMessageContainer);
      });
    });
  }

  public sendIconClickedMessage = (tabId: number, callback: (message: ContentScriptUpdateMessageContainer) => void) => {
    const dispatchModelUpdate = (updateMessage: ContentScriptUpdateMessage) => {
      if (updateMessage.type !== MessageTypes.CS_UPDATE) return;
      if (!CSUpdateMessage.isTrustworthy(updateMessage)) return;

      const updateMessageContainer = new CSUpdateMessage(updateMessage);
      updateMessageContainer.registerTabId(tabId);

      callback(updateMessageContainer);
    }

    chrome.tabs.sendMessage(tabId, createUIActionClickedMsg(), dispatchModelUpdate);
  }
}