import React, {Component, PropTypes} from 'react';
import style  from './style';
import moment from 'moment';

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
      mpdUrl: null,
      time: this.tic(),
      to: setInterval(() => {
        const time = this.tic();
        this.setState({
          time
        });
      }, 1000),
    };
  }

  tic (dateTime = new Date()) {
    const time = moment(dateTime).format('DD-MM-YYYY HH:mm:ss');
    return time;
  }

  componentDidMount () {
    console.log('componentDidMount');
    this.setState({
      player: this.prepPlayer(this.props.mpdUrl),
      mpdUrl: this.props.mpdUrl,
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
    clearTimeout(this.state.to);
  }

  prepPlayer (mpdUrl) {
    const player = dashjs.MediaPlayer().create();
    player.getDebug().setLogToBrowserConsole(false);
    player.initialize(this.refs.videoPlayer, mpdUrl, true);
    return player;
  }

  prepHeaderStyle () {
    if (this.props.period && this.props.period.turnedOn) {
      return {...style.vheader, ...{backgroundColor: 'rgba(218, 242, 112, 0.95)'}}
    }
    return style.vheader;
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
          time={this.state.time}
          videoPlayer={this.refs.videoPlayer}
          styleVheasder={this.prepHeaderStyle()}
        />
        <video ref="videoPlayer" style={{ width: '100%', height: '100%' }} controls/>
      </div>
    );
  }
}
