import MainServer from './api/server';

require('source-map-support').install();

new MainServer().listen().catch((error: Error) => {
  console.error(error);
  process.exit(-1);
});
