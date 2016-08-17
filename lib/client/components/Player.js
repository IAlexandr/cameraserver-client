import React, {Component, PropTypes} from 'react';
import DPlayer from './DPlayer';

export default class Player extends Component {
  static propTypes = {
    camera: PropTypes.object,
    archivePeriod: PropTypes.object,
    width: PropTypes.string,
    height: PropTypes.string,
  };

  render () {
    return (
      <div style={{
        width: this.props.width,
        height: this.props.height,
        float: 'left',
        margin: 0,
        padding: 0
      }}>
        <DPlayer mpdUrl={'/api/cameras/' + this.props.camera._id + '/mpd'} properties={this.props.camera} />
      </div>
    );
  }
}
