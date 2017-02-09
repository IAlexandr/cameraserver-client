import React from 'react';
import {Route} from 'react-router';
import Main from './components/Main';
import View from './components/View';

export default function () {
  return (
    <Route component={Main}>
      <Route path="/" component={View} />
    </Route>
  );
}
