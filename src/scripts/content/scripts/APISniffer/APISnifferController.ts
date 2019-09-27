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
import isOKStatus from '~/utils/isOKStatus';

const Controller: APISnifferControllerStatics = class C implements APISnifferController {
  constructor(
    private model: APISnifferModel, 
    private contentScriptService: APISnifferContentScriptService, 
    private hijacker: APISnifferHijacker, 
    private supportAnalyzer: APISnifferSupportAnalyzer
  ) {}
  
  public analyzePage = () => {
    if (!this.supportAnalyzer.isWindowSupported()) {
      this.model.setStatus(PageStatus.UNSUPPORTED);
      return;
    } else if (!this.supportAnalyzer.isHealthyArchive()) {
      this.model.setStatus(PageStatus.NOT_OK_ARCHIVE);
      return;
    }
  
    const blogname = extractBlogname(window.location.hostname);
    if (!blogname) {
      this.model.setStatus(PageStatus.UNSUPPORTED);
      return;
    } 
  
    this.model.setStatus(PageStatus.OK);
    this.model.setBlogname(blogname);
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
    const status = this.model.getStatus();
    if (isOKStatus(status)) {
      const blogname = this.model.getBlogname();
      const sendToContentScript = (posts: Array<TumblrPost>) => {
        this.contentScriptService.sendPosts(posts);
      };
      this.hijacker
        .hijack(blogname)
        .subscribe(sendToContentScript);
    } else {
      logger.error('Unable to highlight posts on this archive');
    }
  } 
}

export default Controller;