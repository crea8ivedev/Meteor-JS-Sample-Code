Package.describe({
  name: 'npdev:excel',
  summary: 'Parse excel worksheets for your meteor app.',
  version: '0.3.0',
  git: 'https://github.com/netanelgilad/meteor-excel'
})

Npm.depends({
  'xlsx': '0.14.3'
})

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.5')
  api.use('ecmascript')
  api.mainModule('excel.js', 'server', { lazy: true })
})

Package.onTest(function(api) {
  api.use('tinytest')
  api.use('netanelgilad:excel')
  api.addFiles('excel-tests.js')
})
