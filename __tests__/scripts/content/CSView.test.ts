import sinon, { 
  SinonStub 
} from 'sinon';
import { 
  TumblrPost,
  CSView,
  CSStylesGenerator 
} from '~/types';
import View from '~/scripts/content/CSView';

describe('CSView', () => {
  let blogname: string;
  let view: CSView;
  let stylesGenerator: CSStylesGenerator;
  let posts: Array<TumblrPost>;
  let prependStub: SinonStub;
  let removeChildStub: SinonStub;

  /* general setup */
  beforeEach(() => {
    blogname = 'test-bloganme';
    stylesGenerator = {
      reset: sinon.stub(),
      regenerateStyles: sinon.stub() 
    };
    view = new View(stylesGenerator);
    prependStub = sinon.stub(document.head, 'prepend');
    removeChildStub = sinon.stub(document.head, 'removeChild');
    posts = [
      {
        id: 'id-1',
        url: `https://${blogname}.tumblr.com/post/123-1`
      },
      {
        id: 'id-2',
        url: `https://${blogname}.tumblr.com/post/123-2`
      },
      {
        id: 'id-3',
        url: `https://${blogname}.tumblr.com/post/123-3`
      }
    ];
  });

  /* general teardown */
  afterEach(() => {
    sinon.restore();
  });

  describe('highlightPosts()', () => {
    it('should inject CSS element', () => {
      view.highlightPosts(posts);
      
      const regenerateCSSStub = stylesGenerator.regenerateStyles as SinonStub;
      expect(prependStub.calledOnce).toBeTruthy();
      expect(regenerateCSSStub.called).toBeTruthy();
    });

    it('should update element post-injection', () => {
      view.highlightPosts(posts);
      
      expect(prependStub.calledOnce).toBeTruthy();
      let replaceContentStub = sinon.stub(view, 'replaceElementContents' as any);
      
      expect(replaceContentStub.calledOnce).toBeFalsy();
      
      view.highlightPosts(posts);
      
      expect(prependStub.calledTwice).toBeFalsy();
      expect(replaceContentStub.calledOnce).toBeTruthy();
    });
  });

  describe('reset()', () => {
    it('should reset view', () => {
      expect(prependStub.called).toBeFalsy();
      expect(removeChildStub.called).toBeFalsy();
      
      view.highlightPosts(posts);
      expect(prependStub.calledOnce).toBeTruthy();
      
      const generatorResetStub = stylesGenerator.reset as SinonStub;
      
      view.reset();

      expect(removeChildStub.calledOnce).toBeTruthy();
      expect(generatorResetStub.calledOnce).toBeTruthy();

    });
  });
})