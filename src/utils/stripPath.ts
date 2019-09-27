export default (url: string): string => {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    if (!path) return '';

    return path;
  } catch (err) {
    /* bad URL */
    return '';
  }
}