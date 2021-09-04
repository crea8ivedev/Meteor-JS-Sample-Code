import { Slingshot } from 'meteor/edgee:slingshot'

Slingshot.fileRestrictions('pixstoriimages', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
  maxSize: 500000000
})
