# Server

This is the folder containing all server-files necessary to run the application

## server.js

  - The entry file for the server. This spins up a master process responsible to spawn worker and broker processes.

  - nodemon watches for changes on the server side during development. Unfortunately , the restart process isnt straightforward for socketcluster as it also involves killing and restarting the worker and broker processes. As a hack , the below function ensures that the socketcluster kills all processes before restart. But this doesnt work well as the child processes are not properly killed before exiting

    ```js
    if(process.env.NODE_ENV === 'development'){
      process.on('SIGUSR2',function(){
          console.log('SIGUSR2 recieved')
          socketcluster.killWorkers();
          socketcluster.killBrokers();
          process.exit(1)
          // process.kill(process.pid,'SIGUSR2')
        })
    }
    ```

  - there is no use for the test-server as such. Probably use it when we add integration tests.


---

## worker.js

  - Code for child processes started by server.js go here
  - `worker.js` handles both `http` requests and `socket` events.
  - As such ,`http` requests are confined to
    - Initial data to be served to the client
    - Authentication processes
  - Chunk of the work is handled through websockets.
  - Currently, the code for handling socket events are specified either directly in `worker.js` or in the `sockerHandlers` folder. It is better to have all functions in the socketHandlers folder.

---

## init.js

  - Unfortunately , socketcluster needs to execute babel in runtime to compile es6 and JSX.
  - babel compiles all files when the server is booted.

---

## config.js

file responsible to connect to the postgres server.

---

## local_Auth

local-auth contains files used for client authentication during development. These are not use for production

---

## passport

file to support github oauth. There is a slight tweak done here to ensure that a jwt token is generated for every new registration

---

## queries

sql scripts to be used for specific socket-events.

---

## socketHandlers

files responsible for handling socket-events.

---

## server-render

files responsible to get cookie (if exists) from user. Get necessary information (projects subscribed, current level etc) and send it as `window.__INITIAL_STATE__` to the client on startup.

  - TO-DO: move `user-profile.sql` to `queries` folder.

---

## utils

general files to help clean output recieved from postgres

---
