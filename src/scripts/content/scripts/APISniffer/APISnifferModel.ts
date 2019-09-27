import {
  PageStatus,
  APISnifferModel
} from '~/types';

export default class Model implements APISnifferModel {
  private blogname: string = '';
  private status: PageStatus = PageStatus.LOADING;

  public setBlogname = (blogname: string) => {
    this.blogname = blogname;
  }

  public getBlogname = () => this.blogname;
  
  public setStatus = (status: PageStatus) => {
    this.status = status;
  } 

  public getStatus = () => this.status;
}
