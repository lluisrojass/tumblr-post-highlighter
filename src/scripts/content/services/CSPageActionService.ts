import { 
  Observable 
} from 'rxjs';
import {
  MessageTypes,
  ScriptMessage,
  ContentScriptMessageCallback,
  CSPageActionService
} from '~/types';
import isObj from '~/utils/isObj';

export default class PageActionService implements CSPageActionService {
  public sendMessage = (message: ScriptMessage) => {
    chrome.runtime.sendMessage(message);
  }

  public listenForPageActionIconClicks = () => {
    return new Observable<ContentScriptMessageCallback>((subscriber) => {
      chrome.runtime.onMessage.addListener((message: any, sender, respond: ContentScriptMessageCallback) => {
        if (!message || !isObj(message)) return;
        if (message.type !== MessageTypes.ACTION_CLICKED) return;
  
        subscriber.next(respond);

        /* necessary, indicates response to come later */
        return true; 
      });
    });
  }
}
