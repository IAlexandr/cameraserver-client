import React from 'react';
import { Route } from 'react-router';
import Main from './components/Main';
import Monitor from './components/Monitor';

export default function () {
  return (
    <Route component={Main} >
      <Route path="/" component={Monitor} />
    </Route>
  );
}
