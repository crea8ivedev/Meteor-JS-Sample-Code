import { DOMPurify } from 'meteor/pixstori:dompurify'

export default (html) => ({ __html: DOMPurify.sanitize(html, { ADD_TAGS: ['iframe'] }) })
