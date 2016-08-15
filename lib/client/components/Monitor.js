import React, { Component } from 'react';

class Monitor extends Component {
  render () {
    return (
      <div>
        <video style={{width: 'auto', height: '200px'}} controls />
        <video style={{width: 'auto', height: '200px'}} controls />
        <video style={{width: 'auto', height: '200px'}} controls />
        <video style={{width: 'auto', height: '200px'}} controls />
      </div>
    );
  }
}

export default Monitor;
