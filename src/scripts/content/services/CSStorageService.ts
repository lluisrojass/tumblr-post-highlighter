import { 
  CSStorageService
} from '~/types';
import logger from '~/logger/index';
import config from '~/config/index';

export default class StorageService implements CSStorageService {
  private getExcludedBlogs = (): Promise<Array<string>> => {
    return new Promise((resolve, reject) => {
      const key = config.storageKeys.excludeBlog;
      chrome.storage.local.get(key, (storage: { 
        [key: string]: any 
      }) => {
        const blogs = storage[key];
        if (!Array.isArray(blogs)) {
          reject(new Error('storage is unreadable'));
          return;
        }

        resolve(blogs);
      });
    });
  }
  
  private setExcludedBlogs = (newExcludedBlogs: Array<string>): Promise<undefined> => {
    return new Promise((resolve, reject) => {      
      const key = config.storageKeys.excludeBlog;

      chrome.storage.local.set({
        [key]: newExcludedBlogs 
      }, () => {
        if (chrome.runtime.lastError) {
          logger.warn('could not update excluded blog storage');
          reject(new Error('chrome unable to update local storage'));
        }

        resolve();
      });
    });
  }

  public isBlogExcluded = async (blogname: string) => {
    const excludedBlogs = await this.getExcludedBlogs();
    return !!excludedBlogs.find(excludedBlog => excludedBlog === blogname);
  }

  public excludeBlog = async (blogname: string) => {
    const excludedBlogs = await this.getExcludedBlogs();
    /* check if already excluded */
    if (excludedBlogs.find(excludedBlog => excludedBlog === blogname)) return false;

    const newExcludedBlogs = excludedBlogs.concat([blogname]);
    try {
      await this.setExcludedBlogs(newExcludedBlogs);
      return true;
    } catch (err) {
      return false;
    }
  }

  public includeBlog = async (blogname: string) => {
    const excludedBlogs = await this.getExcludedBlogs();
    const index = excludedBlogs.findIndex((excludedBlog) => excludedBlog === blogname);
    if (index < 0) {
      logger.warn('cannot include blog that isn\'t already excluded'); // todo throw useful error here
      return false;
    }

    const newBlogs = [
      ...excludedBlogs.slice(0, index), 
      ...excludedBlogs.slice(index + 1, excludedBlogs.length)
    ];
    
    try {
      await this.setExcludedBlogs(newBlogs);
      return true;
    } catch (err) {
      return false;
    }
  }
}
