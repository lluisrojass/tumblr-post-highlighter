import pkg from '../../package.json';

export default {
  version: pkg.version,
  name: pkg.name,
  tumblr: {
    v2StateKey: '___INITIAL_STATE___',
    v2ServerErrorKey: 'isServerError',
    api: {
      host: 'api.tumblr.com',
      path: '/v2/blog/{{blog}}/posts',
      query: {
        postsKey: 'fields[blogs]',
        postsValue: 'posts'
      }
    }
  },
  storageKeys: {
    excludeBlog: 'excludeBlog'
  }
}