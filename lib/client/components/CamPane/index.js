import React, {Component, PropTypes} from 'react';
import style  from './style';

import Header from './Header';

export default class CamPane extends Component {
  static propTypes = {
    mpdUrl: PropTypes.string,
    close: PropTypes.func,
    properties: PropTypes.object,
    period: PropTypes.object,
    width: PropTypes.string,
    height: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      player: null,
      mpdUrl: null
    };
  }

  componentDidMount () {
    console.log('componentDidMount');
    this.setState({
      player: this.prepPlayer(this.props.mpdUrl),
      mpdUrl: this.props.mpdUrl
    });
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps', nextProps);
    if (nextProps.mpdUrl) {
      if (this.state.mpdUrl !== nextProps.mpdUrl) {
        if (this.state.player) {
          this.state.player.reset();
        }
        this.setState({
          player: this.prepPlayer(nextProps.mpdUrl),
          mpdUrl: nextProps.mpdUrl
        });
      }
    }
  }

  componentWillUnmount () {
    console.log('componentWillUnmount');
    if (this.state.player) {
      this.state.player.reset();
    }
  }

  prepPlayer (mpdUrl) {
    const player = dashjs.MediaPlayer().create();
    player.getDebug().setLogToBrowserConsole(false);
    player.initialize(this.refs.videoPlayer, mpdUrl, true);
    return player;
  }

  render ({ width, height } = this.props) {
    return (
        <div style={{
          width: width,
          height: height,
          float: 'left',
          margin: 0,
          padding: 0,
          position: 'relative',
        }}>
          <Header
            close={() => {
              this.props.close(this.props.properties._id)
            }}
            properties={this.props.properties}
            period={this.props.period}
            videoPlayer={this.refs.videoPlayer}
          />
          <video ref="videoPlayer" style={{ width: '100%', height: '100%' }} controls/>
        </div>
    );
  }
}
