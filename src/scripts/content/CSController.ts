import { 
  Observer 
} from 'rxjs';
import { 
  map 
} from 'rxjs/operators';
import {
  PageStatus,
  APISnifferUpdateMessageContainer,
  TumblrPost,
  CSController,
  CSControllerStatics,
  CSModel,
  CSAPISnifferService,
  CSStorageService,
  CSPageActionService,
  CSView,
  ContentScriptMessageCallback
} from '~/types';
import isOKStatus from '~/utils/isOKStatus';
import createContentScriptUpdateMsg from '~/utils/messageCreators/contentScriptUpdate';

const Controller: CSControllerStatics = class C implements CSController {
  constructor(
    private model: CSModel, 
    private apiSnifferService: CSAPISnifferService, 
    private storageService: CSStorageService,
    private pageActionService: CSPageActionService,
    private view: CSView
  ) {}

  public handleIncomingPosts = () => {
    const updateModel = (posts: Array<TumblrPost>) => {
      this.model.addPosts(posts);
    }

    const highlightPosts = (posts: Array<TumblrPost>) => {
      const status = this.model.getStatus();
      const isExcluded = this.model.getExcluded();
      if (isOKStatus(status) && !isExcluded) {
        this.view.highlightPosts(posts)
      }
    }

    const observer = {
      next: (posts: Array<TumblrPost>) => {
        updateModel(posts);
        highlightPosts(posts);
      },
      complete: () => {},
      error: () => {}
    }

    const filteredPostsObservable = this.apiSnifferService
      .listenForPosts()
      .pipe(map((postsMessageContainer) => {
        const posts = postsMessageContainer.getPosts();
        const currentPosts = this.model.getPosts();
        return posts.filter((newPost: TumblrPost) => (
          !currentPosts.find((post) => post.id === newPost.id)
        ));
      })
    );
    
    filteredPostsObservable
      .subscribe(observer);
  }

  public handleIncomingSnifferUpdates = () => {
    const updateExcludedModel = (isExcluded: boolean) => {
      this.model.setExcluded(isExcluded);
    }

    const highlightCurrentPosts = (isExcluded: boolean) => {
      if (isExcluded) return;

      const posts = this.model.getPosts();
      this.view.reset();
      this.view.highlightPosts(posts);
    }

    const notifyPageAction = (isExcluded: boolean) => {
      const status = this.model.getStatus();
      const update = createContentScriptUpdateMsg({ 
        status, 
        excluded: isExcluded 
      });
 
      this.pageActionService.sendMessage(update);
    }
    
    const updateModel = (status: PageStatus, blogname: string) => {
      this.model.setStatus(status);
      this.model.setBlogname(blogname);
    };
    
    let observer: Observer<APISnifferUpdateMessageContainer> = {
      next: (updateMessageContainer: APISnifferUpdateMessageContainer) => {
        const status = updateMessageContainer.getStatus();
        const blogname = updateMessageContainer.getBlogname();
        updateModel(status, blogname);
        
        if (isOKStatus(status)) {
          const isBlogExcluded = this.storageService
            .isBlogExcluded(blogname);

          isBlogExcluded
            .then((isExcluded) => {
              updateExcludedModel(isExcluded);
              highlightCurrentPosts(isExcluded);
              notifyPageAction(isExcluded);
            });
        } else {
          notifyPageAction(false);
        }
      },
      error: () => {},
      complete: () => {}
    }

    this.apiSnifferService
      .listenForUpdates()
      .subscribe(observer);
  }

  public handleUIClick = () => {
    const toggleExcludedModel = () => {
      this.model.setExcluded(!this.model.getExcluded());
    }

    const updateView = () => {
      const isExcluded = this.model.getExcluded();
      isExcluded
        ? this.view.reset()
        : this.view.highlightPosts(this.model.getPosts());
    }

    const respondWithUpdate = (respond: ContentScriptMessageCallback) => {
      const isExcluded = this.model.getExcluded();
      const status = this.model.getStatus();
      const update = createContentScriptUpdateMsg({ 
        status, 
        excluded: isExcluded 
      });

      respond(update);
    }

    const observer: Observer<ContentScriptMessageCallback> = {
      next: (respond: ContentScriptMessageCallback) => {
        const status = this.model.getStatus();

        if (isOKStatus(status)) {
          const isExcluded = this.model.getExcluded();
          const blogname = this.model.getBlogname();

          const storageChange = isExcluded 
            ? this.storageService.includeBlog(blogname) 
            : this.storageService.excludeBlog(blogname);

          storageChange
            .then((didFinishCorrectly: boolean) => {
              if (didFinishCorrectly) {
                toggleExcludedModel();
                updateView();
              }
              respondWithUpdate(respond);
            });
        } else {
          respondWithUpdate(respond);
        }
      },
      complete: () => {},
      error: () => {}
    }

    this.pageActionService
      .listenForPageActionIconClicks()
      .subscribe(observer)
  }

  public injectAPISniffer = () => {
    this.apiSnifferService.injectAPISniffer();
  }
}

export default Controller;