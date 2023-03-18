import { 
  Observable 
} from 'rxjs';

/**
 * Parent for script controllers.
 */
export interface ExtScriptController {}
export interface ExtScriptStatics<ScriptController extends ExtScriptController> {
  /**
   * Instantiate a new extension script which utilizes 
   * the given controller.
   * 
   * @param {ScriptController}
   * 
   * @returns {ExtScript}
   */
  new(controller: ScriptController): ExtScript
}
/**
 * General parent for extension scripts.
 */
export interface ExtScript {
  /**
   * Runs the extension script.
   * 
   * @returns {void}
   */
  run(): any;
}
export interface InstallerController extends ExtScriptController {
  /**
   * Attaches chrome's extension rules for 
   * showing the page action.
   * 
   * @returns {void}
   */
  attachPageActionRules(): void;
  /**
   * Sets up initial storage keys and default values.
   * 
   * @returns {void}
   */
  setupStorage(): void;
}
export interface UIControllerStatics {
  /**
   * Instantiate a module implementing 
   * the UIController interface.
   * 
   * @param {UIContentScriptService} contentScriptService 
   * @param {UIPageActionService} pageActionService
   * @param {UIView} view
   * 
   * @returns {UIController}
   */
  new(
    contentScriptService: UIContentScriptService, 
    pageActionService: UIPageActionService,
  ): UIController;
}
/**
 * Controller for managing interactions between a tab's page 
 * action and content script pairing.
 */
export interface UIController extends ExtScriptController {
  /**
   * Attach listeners to handle incoming 
   * page action clicks.
   * 
   * @returns {void}
   */
  handleIconClicks(): void;
  /**
   * Attach listeners to handle incoming
   * update messages from a content script.
   * 
   * @returns {void}
   */
  handleContentScriptUpdates(): void;
}
export interface UIPageActionService {
  /**
   * Observe page action icon clicks. 
   * 
   * @returns {Observable<number>}
   */
  listenForIconClicks(): Observable<number>;
  /**
   * Presents a specific view on a tab specified by the tabId.
   * 
   * @param {number} tabId 
   * @param {Views} view
   * 
   * @returns {void}
   */
  showView(tabId: number, view?: Views): void;
}
export interface UIContentScriptService {
  /**
   * Observe update messages inbound from the 
   * page's content script.
   * 
   * @returns {Observable<ContentScriptUpdateMessageContainer>}
   */
  listenForUpdates(): Observable<ContentScriptUpdateMessageContainer>;
  /**
   * Indicate to a content script on a page that the 
   * page action icon was clicked.
   * 
   * @param {number} tabId 
   * @param {function} callback 
   * 
   * @returns {void}
   */
  sendIconClickedMessage(tabId: number, callback: (message: ContentScriptUpdateMessageContainer) => void): void;
}
export interface CSModel {
  /**
   * Update a model's status value.
   * 
   * @param {PageStatus} status
   * 
   * @returns {void}
   */
  setStatus(status: PageStatus): void;
  /**
   * Access a model's status value.
   * 
   * @returns {PageStatus}
   */
  getStatus(): PageStatus;
  /**
   * Update a model's blogname value.
   * 
   * @param {string} blogname
   * 
   * @returns {void}
   */
  setBlogname(blogname: string): void;
  /**
   * Access a model's blog name value.
   * 
   * @returns {string}
   */
  getBlogname(): string;
  /**
   * Update a model's excluded value.
   * 
   * @param {boolean} excluded
   * 
   * @returns {void}
   */
  setExcluded(excluded: boolean): void;
  /**
   * Access a model's excluded value.
   * 
   * @returns {boolean}
   */
  getExcluded(): boolean;
  /**
   * Add posts to a model.
   * 
   * @param {Array<TumblrPost>} posts
   * 
   * @returns {void}
   */
  addPosts(posts: Array<TumblrPost>): void;
  /**
   * Access a model's posts.
   * 
   * @returns {Array<TumblrPost>}
   */
  getPosts(): Array<TumblrPost>;
}
export interface CSController extends ExtScriptController {
  /**
   * Handle incoming Tumblr posts sent from the APISniffer script.
   * 
   * @returns {void}
   */
  handleIncomingPosts(): void;
  /**
   * Handle incoming general updates on the APISniffer's model data.
   * 
   * @returns {void}
   */
  handleIncomingSnifferUpdates(): void;
  /**
   * Handle incoming page action clicks from the 
   * background UI script.
   * 
   * @returns {void}
   */
  handleUIClick(): void;
  /**
   * Inject the APISniffer script into the current page.
   * 
   * @returns {void}
   */
  injectAPISniffer(): void;
}
export interface CSControllerStatics {
  /**
   * Instantiate a module implementing the CSController interface.
   * 
   * @returns {CSController}
   */
  new(
    model: CSModel, 
    apiSnifferService: CSAPISnifferService, 
    storageService: CSStorageService,
    pageActionService: CSPageActionService,
    view: CSView
  ): CSController;
}
export interface CSView {
  /**
   * Highlight the provided posts on the webpage.
   * 
   * @param {Array<TumblrPost>} posts
   * 
   * @returns {void}
   */
  highlightPosts(posts: Array<TumblrPost>): void;
  /**
   * Resets view to the initial state, removing highlighting
   * CSS for all posts.
   * 
   * @returns {void}
   */
  reset(): void;
}
export interface CSViewStatics {
  /**
   * Instantiate a module implementing the CSView interface.
   * 
   * @param {StylesGenerator} stylesGenerator
   * 
   * @returns {CSView}
   */
  new(stylesGenerator: CSStylesGenerator): CSView;
}
export interface CSStylesGenerator {
  /**
   * Reset the generator to its initial state, with no
   * posts highlighted.
   * 
   * @returns {void}
   */
  reset(): void;
  /**
   * Regenerate the CSS payload to include the provided posts.
   * 
   * @param {Array<TumblrPost>} posts
   * 
   * @returns {string}
   */
  regenerateStyles(posts: Array<TumblrPost>): string;
}
export interface CSPageActionService {
  /**
   * Send a ScriptMessage to the page action's background script.
   * 
   * @param {ScriptMessage} message 
   */
  sendMessage(message: ScriptMessage): void;
  /**
   * Observe a page action's icon click on the 
   * tab which hosts the content script.
   * 
   * @returns {Observable<ContentScriptMessageCallback>}
   */
  listenForPageActionIconClicks(): Observable<ContentScriptMessageCallback>;
}
export interface CSStorageService {
  /**
   * Query storage and evaluate whether a blog is
   * excluded or not.
   * 
   * @param {string} blogname 
   * 
   * @returns {Promise<boolean>}
   */
  isBlogExcluded(blogname: string): Promise<boolean>;
  /**
   * Mark a blog as excluded in storage.
   * Promise 
   * 
   * @param {string} blogname 
   * 
   * @returns {Promise<boolean>} denotes the success of the operation. 
   */
  excludeBlog(blogname: string): Promise<boolean>;
  /**
   * Remove a blog from excluded storage. Promise resolves 
   * with a 
   * 
   * @param {string} blogname 
   * 
   * @returns {Promise<boolean>} denotes a boolean confirming the success of the operation.
   */
  includeBlog(blogname: string): Promise<boolean>;
}
export interface CSAPISnifferService {
  /**
   * Observe incoming posts from the APISniffer.
   * 
   * @returns {Observable<PostsMessageContainer>}
   */
  listenForPosts(): Observable<PostsMessageContainer>;
  /**
   * Observe incoming APISniffer updates.
   * 
   * @returns {Observable<APISnifferUpdateMessageContainer>}
   */
  listenForUpdates(): Observable<APISnifferUpdateMessageContainer>;
  /**
   * Creates and injects a script element onto the page 
   * with the contents of the APISniffer script.
   * 
   * @returns {void}
   */
  injectAPISniffer(): void;
}
/**
 * Represents an individual post found in 
 * responses from Tumblr's V2 API.
 */
export interface NativeTumblrPost {
  id: string;
  /**
   * The direct URL for accessing the post.
   * Used as the main cta url in an archive post.
   */
  postUrl: string;
  /**
   * URL for a post's original page. 
   */
  sourceUrl?: string;
  /**
   * Contains trail entries with information about a 
   * posts history.
   */
  trail?: Array<TrailEntry>;
}
export interface MaybeTumblrPost {
  id?: string,
  url?: string
}
/**
 * Internal application representation for a Tumblr post. 
 */
export interface TumblrPost extends MaybeTumblrPost {
  id: string,
  url: string
}
/**
 * Individual entry in a post's trail.
 */
export interface TrailEntry {
  blog?: {
    name?: string;
  }
}
/**
 * Represents the response structure for an API call returning more 
 * archive posts.
 */
export type TumblrAPIResponse = {
  response?: {
    posts?: Array<NativeTumblrPost>;
  } 
}
/**
 * Represents an APISniffer update.
 */
export interface APISnifferUpdate {
  status: PageStatus;
  blogname: string;
}
/**
 * Event containing an APISniffer update.
 */
export type APISnifferUpdateEvent = ScriptEvent<{ update: APISnifferUpdate }>;
/**
 * Event containing APISniffer posts.
 */
export type PostsEvent<Posts extends Array<MaybeTumblrPost>> = ScriptEvent<{ posts: Posts }>;
/**
 * Represents a content script update.
 */
export interface ContentScriptUpdate {
  status: PageStatus;
  excluded: boolean;
}
/**
 * Represents an internal application message.
 */
export interface ScriptMessage {
  type: MessageTypes;
}
/**
 * Parent interface for internal script events.
 * These are used for cross script communication via the DOM.
 */
export interface ScriptEvent<T = any> extends CustomEvent<T> {}
/**
 * Internal message explaining an update to the content script.
 */
export interface ContentScriptUpdateMessage extends ScriptMessage {
  type: MessageTypes.CS_UPDATE;
  update: ContentScriptUpdate;
}
/**
 * General function which takes a content script update 
 * message as a parameter.
 */
export type ContentScriptMessageCallback = (message: ContentScriptUpdateMessage) => any
/**
 * Internal message specifying a page action icon click.
 */
export interface ActionClickedMessage extends ScriptMessage {
  type: MessageTypes.ACTION_CLICKED,
}
/**
 * Statics for a container class representing an internal 
 * message.
 */
export interface MessageContainerStatics<Message = ScriptMessage | ScriptEvent, Container = MessageContainer> {
  new (message: Message): Container;
  /**
   * Asserts the authenticity of a message. 
   * 
   * @param {any} message
   * 
   * @returns {boolean}
   */
  isTrustworthy(message: any): boolean;
}
/**
 * Empty parent interface.
 */
export interface MessageContainer {}
export interface ContentScriptUpdateMessageContainer extends MessageContainer {
  /**
   * Attach a tabId to the message. 
   * 
   * @param {number} tabId 
   * 
   * @returns {void}
   */
  registerTabId(tabId: number): void;
  /**
   * Returns the tabId associated with the content script 
   * if one was previously registered, otherwise undefined.
   * 
   * @returns {number | undefined} 
   */
  getTabId(): number | undefined;
  /**
   * Returns the excluded value of the update message.
   * 
   * @returns {boolean}
   */
  getExcluded(): boolean;
  /**
   * Returns the page status of the update message.
   * 
   * @returns {PageStatus}
   */
  getStatus(): PageStatus;
}
export interface APISnifferUpdateMessageContainer extends MessageContainer {
  /**
   * Returns the page status of the message.
   * 
   * @returns {PageStatus}
   */
  getStatus(): PageStatus;
  /**
   * Returns the blogname of the message.
   * 
   * @returns {string}
   */
  getBlogname(): string;
}
export interface PostsMessageContainer extends MessageContainer {
  /**
   * Get posts in the message.
   * 
   * @returns {Array<TumblrPost>}
   */
  getPosts(): Array<TumblrPost>;
}
export interface APISnifferSupportAnalyzer {
  /**
   * Make assertions on the web page to judge 
   * support for sniffing.
   * 
   * @returns {boolean}
   */
  isWindowSupported(): boolean;
  /**
   * Assert whether the current archive page is 
   * ok to preform tasks on.
   * 
   * @returns {boolean}
   */
  isHealthyArchive(): boolean;
}
export interface APISnifferModel {
  /**
   * Set a model's blogname.
   * 
   * @param {string} blogname 
   * 
   * @returns {void}
   */
  setBlogname(blogname: string): void;
  /**
   * Get a model's blogname.
   * 
   * @returns {string}
   */
  getBlogname(): string;
  /**
   * Set a model's status value.
   * 
   * @param {string} status 
   * 
   * @returns {void}
   */
  setStatus(status: PageStatus): void;
  /**
   * Get a model's status value.
   * 
   * @returns {PageStatus}
   */
  getStatus(): PageStatus;
}
export interface APISnifferContentScriptService {
  /**
   * Send posts to the content script on
   * the current tab.
   * 
   * @param {Array<TumblrPost>} posts 
   * 
   * @returns {void}
   */
  sendPosts(posts: Array<TumblrPost>): void;
  /**
   * Send a general update to the content script
   * living on the current tab.
   * 
   * @param {APISnifferUpdate} update 
   * @returns {void}
   */
  sendUpdate(update: APISnifferUpdate): void;
}
export interface APISnifferRequestAnalyzer {
  /**
   * Evaluates a fetch call's parameters to 
   * judge whether it is/is not a posts yielding API
   * call.
   * 
   * @param {RequestInfo} info 
   * @param {RequestInit | undefined} init 
   * 
   * @returns {boolean}
   */
  isAPICall(info: RequestInfo | URL, init?: RequestInit): boolean;
}
export interface APISnifferRequestAnalyzerStatics {
  /**
   * Instantiates a new module implementing the APISnifferRequestAnalyzer interface.
   * 
   * @param {string} blogname 
   * 
   * @returns {APISnifferRequestAnalyzer}
   */
  new(blogname: string): APISnifferRequestAnalyzer;
}
export interface APISnifferPostsExtractor {
  /**
   * Extract Tumblr posts given from an API response.
   * 
   * @param {Response} fetchResponse 
   * 
   * @returns {Promise<Array<TumblrPost>>}
   */
  extract(fetchResponse: Response): Promise<Array<TumblrPost>>;
}
export interface APISnifferPostsExtractorStatics {
  /**
   * Instantiates a module implementing the APISnifferPostsExtractor interface
   * 
   * @param {string} blogname
   * 
   * @returns {APISnifferPostsExtractor}
   */
  new(blogname: string): APISnifferPostsExtractor;
}
export interface APISnifferHijacker {
  /**
   * Observe personal identified Tumblr posts found via
   * Hijacking ajax calls.
   * 
   * @param {string} blogname 
   * 
   * @returns {Observable<Array<TumblrPost>>}
   */
  hijack(blogname: string): Observable<Array<TumblrPost>>
}
export interface APISnifferHijackerStatics {
  /**
   * Instantiates a module implementing the APISnifferHijacker interface.
   * 
   * @param {APISnifferRequestAnalyzer} RequestAnalyzer
   * @param {APISnifferPostsExtractor} PostsExtractor 
   * 
   * @returns {APISnifferHijacker}
   */
  new(
    RequestAnalyzer: APISnifferRequestAnalyzerStatics, 
    PostsExtractor: APISnifferPostsExtractorStatics
  ): APISnifferHijacker
}
export interface APISnifferController extends ExtScriptController {
  /**
   * Analyze the current page, update model with outcome of analysis.
   * 
   * @returns {void}
   */
  analyzePage(): void;
  /**
   * Send an update to the content script.
   * 
   * @returns {void}
   */
  sendUpdateToContentScript(): void;
  /**
   * Hijack ajax responses, handle observed posts.
   * 
   * @returns {void}
   */
  hijackAjaxRequests(): void;
}
export interface APISnifferControllerStatics {
  /**
   * Instantiate a new module implementing the APISnifferController interface.
   * 
   * @param {APISnifferModel} model
   * @param {APISnifferContentScriptService} contentScriptService 
   * @param {APISnifferHijacker} hijacker
   * @param {APISnifferSupportAnalyzer} supportAnalyzer
   * 
   * @returns {APISnifferController}
   */
  new(
    model: APISnifferModel, 
    contentScriptService: APISnifferContentScriptService,
    hijacker: APISnifferHijacker,
    supportAnalyzer: APISnifferSupportAnalyzer
  ): APISnifferController
}
/**
 * Represents the status of the archive
 * page contextualizing a content script.
 */
export enum PageStatus {
  OK = 'OK',
  NOT_OK_ARCHIVE = 'NOT_OK_ARCHIVE',
  LOADING = 'LOADING',
  UNSUPPORTED = 'UNSUPPORTED'
};
/**
 * Constants representing a view for a page action icon.
 */
export enum Views {
  TURNED_OFF = 'TURNED_OFF',
  UNSUPPORTED = 'UNSUPPORTED',
  OK = 'OK'
}
/**
 * Identifiers for cross script messages.
 */
export enum MessageTypes {
  CS_UPDATE = 'CS_UPDATE',
  API_SNIFFER_UPDATE = 'API_SNIFFER_UPDATE',
  ACTION_CLICKED = 'ACTION_CLICKED',
  NEW_POSTS = 'NEW_POSTS'
}
/**
 * Supported log levels.
 */
export enum LogLevels {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  INFO = 'info',
  DEBUG = 'debug'
}