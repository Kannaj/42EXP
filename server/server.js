require('dotenv').config({ silent: true });

import { SocketCluster } from 'socketcluster';

const main = () => {
  let workerCount;

  if (typeof (window) === 'undefined') {
    global.window = {};
  }

  if (process.env.NODE_ENV === 'development') {
    workerCount = 1;
  } else {
    workerCount = 2;
  }

  var socketcluster = new SocketCluster({
    workers: workerCount,
    brokers: 1,
    port: 8000,
    appName: null,
    initController: __dirname + '/init.js',
    workerController: __dirname + '/worker.js',
    brokerController: __dirname + '/broker.js',
    socketChannelLimit: 1000,
    crashWorkerOnError: true,
  })

// the below helps nodemon to deal with server code changes in development. relevant github-issue: https://github.com/SocketCluster/socketcluster/issues/108
// this seems to create a lot of zombie processes in the container - need to look at this later

  if (process.env.NODE_ENV === 'development') {
    process.on('SIGUSR2', function () {
      console.log('SIGUSR2 recieved');
      socketcluster.killWorkers();
      socketcluster.killBrokers();
      process.exit(1);
    });
  }
};

// useful for testing purposes
export const test = () => {
  return new SocketCluster({
    workers: 1,
    brokers: 1,
    port: 3000,
    appName: null,
    initController: __dirname + '/init.js',
    workerController: __dirname + '/worker.js',
    brokerController: __dirname + '/broker.js',
    socketChannelLimit: 1000,
    crashWorkerOnError: true,
  });
};

if (require.main === module) {
  main();
}
