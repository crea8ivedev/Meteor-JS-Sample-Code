Package.describe({
  name: 'jimmiebtlr:slingshot-cloudinary',
  version: '0.0.9',
  summary: 'Cloudinary storage implementation for edgee:slingshot.',
  git: 'https://github.com/jimmiebtlr/meteor-slingshot-cloudinary',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  var packages = [
    'ecmascript',
    'check',
    'underscore',
    'edgee:slingshot@0.7.1'
  ];

  api.use(packages, 'server');

  api.addFiles('server.js','server');
});
