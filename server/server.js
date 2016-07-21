require('dotenv').config();

import {SocketCluster} from 'socketcluster';




const main = () => {
  console.log('main server')

  if (typeof(window) == 'undefined'){
      global.window = new Object();
      console.log(window)
  }

  new SocketCluster({
    workers:1,
    brokers:1,
    port: 8000,
    appName:null,
    initController: __dirname + '/init.js',
    workerController: __dirname + '/worker.js',
    brokerController: __dirname + '/broker.js',
    socketChannelLimit: 1000,
    crashWorkerOnError: true
  })
}

// useful for testing purposes
export const test = () => {
  console.log('testing server')
  return new SocketCluster({
    workers:1,
    brokers:1,
    port: 3000,
    appName:null,
    initController: __dirname + '/init.js',
    workerController: __dirname + '/worker.js',
    brokerController: __dirname + '/broker.js',
    socketChannelLimit: 1000,
    crashWorkerOnError: true
  })
}

if (require.main === module){
  main()
}
