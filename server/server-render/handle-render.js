// the below deals with ServerSide Rendering
// check isomorphic-react/universal react/ react-redux universal
// this should ideally hit when requesting main page
import React from 'react';
import { Route, RouterContext, match} from 'react-router'
import routes from '../../shared/routes/routes.jsx';
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../../shared/reducers/index.js';
import getInitialState from './getInitialState.js';
import log_middleware from '../../shared/middleware/log_middleware.js'
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
          const createStoreWithMiddleware = applyMiddleware(log_middleware,thunk)(createStore);
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
        <title>42 Exp - Find a team for your project idea</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="/style.css">
        <link rel="stylesheet" type="text/css" href="/assets/css/ionicons.min.css">
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
