module.exports = {
  client: {
    name: 'graphql-vscode-client-test',
    service: {
      url: 'http://localhost:3000/graphql'
    },
    includes: ['{apps,libs}/**/*.ts'],
    excludes: ['apps/api/**/*']
  }
};
