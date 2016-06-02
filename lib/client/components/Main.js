import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class Base extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  render () {
    return (
      <div style={{ height: '100%' }}>
        <h2>
          Main
          { this.props.children }
        </h2>
      </div>
    );
  }
}
