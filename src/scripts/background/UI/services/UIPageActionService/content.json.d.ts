export interface Path {
  16: string,
  32: string,
  48: string,
  128: string
}

interface ViewContent {
  title: string,
  path: Path
}

interface Content {
  views: {
    [key: string]: ViewContent
  }
}

declare const Content: Content;
export default Content;
