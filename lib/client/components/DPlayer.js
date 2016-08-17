import React, {Component, PropTypes} from 'react';
import CamContainer from './cam-container/CamContainer';
import {monitorActions} from './../actions';
import {connect} from 'react-redux';

export default class DPlayer extends Component {
  static propTypes = {
    mpdUrl: PropTypes.string,
    properties: PropTypes.object
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

  render () {
    return (
      <CamContainer close={() => this.props.removePlayer(this.props.properties._id)} properties={this.props.properties}>
        <video ref="videoPlayer" style={{ width: '100%', height: '100%' }} controls/>
      </CamContainer>
    );
  }
}

export default connect(null, {
  removePlayer: monitorActions.removePlayer,
})(DPlayer);
