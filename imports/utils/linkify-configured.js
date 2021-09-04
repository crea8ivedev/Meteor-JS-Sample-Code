import * as linkify from 'linkifyjs'
import hashtag from 'linkifyjs/plugins/hashtag'
import mention from 'linkifyjs/plugins/mention'
import { Link } from 'react-router-dom'
hashtag(linkify)
mention(linkify)
export default linkify
export const linkifyOpts = {
  attributes (href, type) {
    switch (type) {
      case 'hashtag':
        return { to: '/tags/' + href.substring(1) }
      case 'mention':
        return { to: '/mentions/' + href.substring(1) }
      default:
        return { href }
    }
  },
  tagName: {
    mention: () => Link,
    hashtag: () => Link
  }
}
