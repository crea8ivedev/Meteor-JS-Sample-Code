/* global Package */
Package.describe({
  name: 'pixstori:dompurify',
  summary: 'A simple wrapper to enable dompurify use on client and server in Meteor',
  description: 'A simple wrapper to enable dompurify on the server using jsdom.',
  version: '1.0.10'
})

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.5')
  api.use('ecmascript')
  api.mainModule('client.js', 'client')
  api.mainModule('server.js', 'server')
})
