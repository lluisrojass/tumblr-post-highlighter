import {
  PageStatus,
  TumblrPost,
  CSModel 
} from '~/types';

export default class Model implements CSModel {
  private status: PageStatus = PageStatus.LOADING;
  private blogname: string = '';
  private posts: Array<TumblrPost> = [];
  private excluded: boolean = false;

  public setStatus = (status: PageStatus) => {
    this.status = status;
  }

  public getStatus = () => this.status;
  
  public setBlogname = (blogname: string) => {
    this.blogname = blogname;
  }

  public getBlogname = () => this.blogname
  
  public addPosts = (posts: Array<TumblrPost>) => {
    this.posts = this.posts.concat(posts);
  }
  
  public getPosts = () => this.posts

  public setExcluded = (excluded: boolean) => {
    this.excluded = excluded;
  }

  public getExcluded = () => this.excluded
}
