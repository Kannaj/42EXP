// the below deals with ServerSide Rendering
// check isomorphic-react/universal react/ react-redux universal
// this should ideally hit when requesting main page
import React from 'react';
import { Route,RouterContext, match} from 'react-router'
import routes from '../../shared/routes/routes.jsx';
import {renderToString} from 'react-dom/server'
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../../shared/reducers/index.js';
import getInitialState from './getInitialState.js';
import log_middleware from '../../shared/middleware/log_middleware.js'
import notificationsMiddleware from '../../shared/middleware/notifications_unread.js'
import thunk from 'redux-thunk';

const handleRender = (req,res) => {



  let id_token;
  if (req.cookies){

    id_token = req.cookies.id_token
  }else{

    id_token = null;
  }

  match({ routes,location: req.url}, (err,redirect,renderProps) => {
    if (err) {
      return res.status(500).end('Internal server error');
    }
    if (!renderProps) return res.status(404).end('Not found');
    getInitialState(id_token)
      .then((initialState) => {
          // const store = createStore(rootReducer,initialState);
          const createStoreWithMiddleware = applyMiddleware(log_middleware,thunk,notificationsMiddleware)(createStore);
          const store = createStoreWithMiddleware(rootReducer,initialState)

          const html = renderToString(
            <Provider store={store}>

                <RouterContext {...renderProps} />

            </Provider>
          );

          res.send(renderFullPage(html,initialState));
        })
      .catch(function(err){
        //what to do here ?? getInitialState actually returns isAuth=false for this as well
        console.log('error: ',err)
      })
    });
}

const renderFullPage = (html,initialState) => {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal</title>

        <link rel="stylesheet" type="text/css" href="/style.css">
        <link rel="stylesheet" href="/font-awesome.min.css">
        <link rel="stylesheet" href="/react-select.min.css">
        <link rel="stylesheet" href="/highlight/styles/dracula.css">

      </head>
      <body>
        <div id="app"><div>${html}</div></div>
        <script>
          window.__INITIAL_STATE__= ${JSON.stringify(initialState).replace(/</g, '\\u003c')}
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>`
}

export default handleRender;
