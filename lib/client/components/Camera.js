import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import Clear from 'material-ui/svg-icons/content/clear';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Paper from 'material-ui/Paper';
import Slider from 'material-ui/Slider';
import ReactDOM from 'react-dom';

class Camera extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: null,
      mpdUrl: null,
      viewHeight: 0,
      viewWidth: 0,
    };

    this.windowResizeHandler = this.windowResizeHandler.bind(this);
  }

  windowResizeHandler() {
    if (this.refs.videoPlayer) {
      this.setState({
        viewWidth: ReactDOM.findDOMNode(this.refs.videoPlayer).clientWidth,
        viewHeight: ReactDOM.findDOMNode(this.refs.videoPlayer).clientHeight
      });
    }
  }

  createPlayer(mpdUrl) {
    const player = dashjs.MediaPlayer().create();
    player.initialize(this.refs.videoPlayer, mpdUrl, true);
    player.getDebug().setLogToBrowserConsole(false);
    player.on('manifestLoaded', function () {
      if (this.refs.videoPlayer) {
        this.setState({
          viewWidth: ReactDOM.findDOMNode(this.refs.videoPlayer).clientWidth,
          viewHeight: ReactDOM.findDOMNode(this.refs.videoPlayer).clientHeight
        });
      }
    }, this);
    return player;
  }

  componentDidMount() {
    this.setState({
      player: this.createPlayer(this.props.mpdUrl),
      mpdUrl: this.props.mpdUrl,
    });
    this.setState({
      viewWidth: ReactDOM.findDOMNode(this.refs.videoPlayer).clientWidth,
      viewHeight: ReactDOM.findDOMNode(this.refs.videoPlayer).clientHeight
    });

    window.onresize = this.windowResizeHandler;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.width !== this.props.width
      || nextProps.height !== this.props.height
    ) {
      this.setState({
        viewWidth: nextProps.width,
        viewHeight: nextProps.height
      });
    }

    if (nextProps.mpdUrl) {
      if (this.state.mpdUrl !== nextProps.mpdUrl) {
        if (this.state.player) {
          this.state.player.reset();
        }
        this.setState({
          player: this.createPlayer(nextProps.mpdUrl),
          mpdUrl: nextProps.mpdUrl,
          viewWidth: ReactDOM.findDOMNode(this.refs.videoPlayer).clientWidth,
          viewHeight: ReactDOM.findDOMNode(this.refs.videoPlayer).clientHeight
        });
      }
    }
  }

  componentWillUnmount() {
    if (this.state.player) {
      this.state.player.reset();
      window.removeEventListener('resize', this.windowResizeHandler, 'false');
    }
  }

  render({ width, height, close } = this.props) {
    return (
      <div style={{
        width: 'calc(' + width + ' - 4px)',
        height,
        float: 'left',
        border: 'solid rgb(255, 255, 255)',
        borderWidth: '2px 2px 2px 2px',
        margin: 0,
        padding: 0,
        position: 'relative',
      }}>
        <div
          style={{
            background: 'red'
          }}
        >
          <FloatingActionButton
            mini={true}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 99
            }}
            onClick={() => {
              close();
            }}
          >
            <Clear />
          </FloatingActionButton>
          <video
            ref="videoPlayer"
            style={{
              width: '100%',
              height: '100%'
            }}
          />

          <Paper
            style={{
              width: this.state.viewWidth,
              opacity: 0.7,
              height: this.state.viewHeight + 4,
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 98
            }}
            zDepth={1}
          >
          </Paper>
        </div>
      </div>
    );
  }
}

Camera.propTypes = {
  mpdUrl: PropTypes.string,
  close: PropTypes.func,
  properties: PropTypes.object,
  period: PropTypes.object,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default Camera;
