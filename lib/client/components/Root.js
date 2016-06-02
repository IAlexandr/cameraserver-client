import React, { Component } from 'react';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import routes from './../routes';
import reducers from './../reducers';

const createThunkedStore = applyMiddleware(thunk)(createStore);

export default class Root extends Component {
  constructor (props) {
    super(props);

    this.state = {
      store: createThunkedStore(combineReducers(reducers))
    };
  }

  render () {
    return (
      <Provider store={this.state.store}>
        <Router history={browserHistory} children={routes()} />
      </Provider>
    );
  }
}
