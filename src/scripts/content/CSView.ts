import { 
  TumblrPost,
  CSStylesGenerator,
  CSViewStatics,
  CSView
} from '~/types';
import logger from '~/logger/index';

const View: CSViewStatics = class V implements CSView {
  constructor(private cssGenerator: CSStylesGenerator){} 

  private styleElement?: HTMLStyleElement;

  private injectElement = (element: HTMLStyleElement): void => {
    const head = document.head || document.querySelector('head');
    head.prepend(element);
  }

  private createStyleElement = (css: string): HTMLStyleElement => {
    const element = document.createElement<'style'>('style');
    element.setAttribute('type', 'text/css');

    const cssText = document.createTextNode(css);
    element.appendChild(cssText);
    
    return element;
  }

  private replaceElementContents = (css: string): void => {
    if (!this.styleElement) {
      logger.warn('could not update css, style element does not exist');
      return;
    }

    this.styleElement.innerText = css;
  }

  public highlightPosts = (posts: Array<TumblrPost>) => {
    if (!posts.length) return;

    let css = this.cssGenerator.regenerateStyles(posts);
    if (!this.styleElement) {
      const styleElement = this.createStyleElement(css);
      this.styleElement = styleElement;
      this.injectElement(styleElement);
    } else {
      this.replaceElementContents(css);
    }
  }

  public reset = () => {
    const head = document.head || document.querySelector('head');
    try {
      if (this.styleElement) {
        head.removeChild(this.styleElement); 
      }
    } catch (err) {
      logger.warn(`unable to properly destroy style element: ${err}`);
    } finally {
      this.cssGenerator.reset();
      this.styleElement = undefined;
    }
  }
}

export default View;