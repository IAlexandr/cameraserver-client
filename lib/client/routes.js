import React from 'react';
import { Route } from 'react-router';
import Main from './components/Main';
import Home from './components/Home';

export default function () {
  return (
    <Route component={Main} >
      <Route path="/" component={Home} />
    </Route>
  );
}
