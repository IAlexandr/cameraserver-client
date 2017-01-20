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
    this.setState({
      player: this.prepPlayer(this.props.mpdUrl),
      mpdUrl: this.props.mpdUrl,
    });
  }

  componentWillReceiveProps (nextProps) {
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

  prepHeader () {

    const title = (
      <div>{this.props.properties.name}</div>
    );

    let time = this.state.time;

    let left;

    if (this.props.period && this.props.period.turnedOn) {
      let {startDate, startTime} = this.props.period;
      const startPeriod = moment(startDate);
      startTime = moment(startTime);
      startPeriod.hour(startTime.hour());
      startPeriod.minute(startTime.minute());
      startPeriod.second(0);
      let curTime = this.refs.videoPlayer ? this.refs.videoPlayer.currentTime : 0;
      startPeriod.add(curTime, 's');
      left = (
        <div style={{ textAlign: 'center' }}>
          Архив
        </div>
      );

      time = startPeriod.format('DD-MM-YYYY HH:mm:ss');
    }

    return (
      <Header
        close={() => {
          this.props.close(this.props.properties.id)
        }}
        properties={this.props.properties}
        title={title}
        left={left}
        time={time}
        videoPlayer={this.refs.videoPlayer}
        styleVheasder={this.prepHeaderStyle()}
      />
    );
  }

  render ({ width, height } = this.props) {
    return (
      <div style={{
        width: 'calc(' + width + ' - 4px)',
        height: height,
        float: 'left',
        border: 'solid rgb(255, 255, 255)',
        borderWidth: '2px 2px 2px 2px',
        margin: 0,
        padding: 0,
        position: 'relative',
      }}>
        {this.prepHeader()}
        <video ref="videoPlayer" style={{ width: '100%', height: '100%' }} controls/>
      </div>
    );
  }
}
