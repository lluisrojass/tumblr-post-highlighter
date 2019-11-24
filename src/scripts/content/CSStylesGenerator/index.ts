import { 
  CSStylesGenerator,
  TumblrPost 
} from '~/types';
import stripPath from '~/utils/stripPath';
import cssString from './template.css';

type SelectorCache = {
  postBlock: string,
  postBlockHover: string,
  postBlockPseudo: string,
  postBlockHoverChildren: string,
  postBlockChildren: string,
}

type SelectorGenerator = (posts: Array<TumblrPost>) => SelectorCache;

export default class StylesGenerator implements CSStylesGenerator {
  private selectorGenerator?: SelectorGenerator;

  private generateSelectors = (): SelectorGenerator => {
    const selectorCache: SelectorCache = {
      postBlock: '',
      postBlockHover: '',
      postBlockPseudo: '',
      postBlockHoverChildren: '',
      postBlockChildren: ''
    };

    return (posts) => {
      const URLs = posts
        .map(post => post.url)
        .map(stripPath)
        .filter(Boolean);

      if (!URLs.length) {
        throw new Error('no post data available to re-generate css');
      }

      const postBlock: Array<string> = [];
      const postBlockHover: Array<string> = [];
      const postBlockPseudo: Array<string> = [];
      const postBlockHoverChildren: Array<string> = [];
      const postBlockChildren: Array<string> = [];
      
      URLs.forEach((pathOrUrl) => {
        const blockSelector = `a[href*="${pathOrUrl}"]`;
  
        postBlock.push(blockSelector);
        postBlockHover.push(`${blockSelector}:hover`);
        postBlockChildren.push(`${blockSelector} *`); 
        postBlockHoverChildren.push(`${blockSelector}:hover *`);
        postBlockPseudo.push(`${blockSelector}:after`);
      });

      selectorCache.postBlock += 
        `${selectorCache.postBlock && ','}${postBlock.join(',')}`;
      selectorCache.postBlockHover += 
        `${selectorCache.postBlockHover && ','}${postBlockHover.join(',')}`;
      selectorCache.postBlockPseudo += 
        `${selectorCache.postBlockPseudo && ','}${postBlockPseudo.join(',')}`;
      selectorCache.postBlockHoverChildren += 
        `${selectorCache.postBlockHoverChildren && ','}${postBlockHoverChildren.join(',')}`;
      selectorCache.postBlockChildren += 
        `${selectorCache.postBlockChildren && ','}${postBlockChildren.join(',')}`;

      return selectorCache;
    }
  }

  public reset = (): void => {
    this.selectorGenerator = this.generateSelectors();
  }

  public regenerateStyles = (posts: Array<TumblrPost>): string => {
    this.selectorGenerator = this.selectorGenerator || this.generateSelectors();

    const {
      postBlock,
      postBlockHover,
      postBlockPseudo,
      postBlockHoverChildren,
      postBlockChildren
    } = this.selectorGenerator(posts);

    return cssString
      .replace('#post-block', postBlock)
      .replace('#post-block:hover', postBlockHover)
      .replace('#post-block *', postBlockChildren)
      .replace('#post-block:hover *', postBlockHoverChildren)
      .replace('#post-block:after', postBlockPseudo);
  }
}
