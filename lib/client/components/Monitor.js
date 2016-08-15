import React, { Component } from 'react';

class Monitor extends Component {
  render () {
    return (
      <div>
        <video style={{width: '100%', height: '100%'}} controls />
      </div>
    );
  }
}

export default Monitor;
