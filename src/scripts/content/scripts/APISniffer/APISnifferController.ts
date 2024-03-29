import { 
  PageStatus,
  TumblrPost,
  APISnifferController,
  APISnifferControllerStatics,
  APISnifferModel,
  APISnifferContentScriptService,
  APISnifferHijacker,
  APISnifferSupportAnalyzer
} from '~/types';
import extractBlogname from '~/utils/extractBlogname';
import logger from '~/logger/index';

const Controller: APISnifferControllerStatics = class C implements APISnifferController {
  constructor(
    private model: APISnifferModel, 
    private contentScriptService: APISnifferContentScriptService, 
    private hijacker: APISnifferHijacker, 
    private supportAnalyzer: APISnifferSupportAnalyzer
  ) {}

  public obtainBlogName = () => {
    const blogname = extractBlogname(window.location.hostname);
    if (!blogname) {
      logger.warn('Unable to extract blog name');
      return;
    }

    this.model.setBlogname(blogname);
  }
  
  public obtainPageStatus = (): Promise<void> => {

    const obtainStatusAndUpdateModel = () => {
      const status = this.obtainPageStatusFromDocument();
      this.model.setStatus(status);
    }
    
    if (document.readyState === 'complete') {
      obtainStatusAndUpdateModel();
      return Promise.resolve(undefined);
    }

    return new Promise((resolve) => {
      document.addEventListener('readystatechange', (e) => {
        // @ts-ignore
        if (e.target?.readyState !== 'complete') return;

        obtainStatusAndUpdateModel();
        resolve();
      });
    })
  }

  private obtainPageStatusFromDocument = () => {
    if (!this.supportAnalyzer.isWindowSupported()) return PageStatus.UNSUPPORTED;
    else if (!this.supportAnalyzer.isHealthyArchive()) return PageStatus.NOT_OK_ARCHIVE;
    
    return PageStatus.OK;
  }
  
  public sendUpdateToContentScript = () => {
    const status = this.model.getStatus();
    const blogname = this.model.getBlogname();
    
    this.contentScriptService.sendUpdate({ 
      status,
      blogname
    });
  }
  
  public hijackAjaxRequests = () => {
    const blogname = this.model.getBlogname();
    if (!blogname) {
      console.warn('Unable to hijack requests, no blogname available');
      return;
    }

    const sendToContentScript = (posts: Array<TumblrPost>) => {
      this.contentScriptService.sendPosts(posts);
    };

    this.hijacker
      .hijack(blogname)
      .subscribe(sendToContentScript);
  } 
}

export default Controller;