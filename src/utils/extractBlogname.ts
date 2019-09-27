export default (hostname: string): string => {
  const pattern = /^([a-z0-9]+(?:\-+[a-z0-9]+)*)+\.tumblr\.com$/i;
  const matches = Array.prototype.concat.call([], hostname.match(pattern));
  if (matches.length < 2) return '';

  return matches[1];
}
