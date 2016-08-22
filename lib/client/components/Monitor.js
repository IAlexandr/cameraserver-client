import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Player from './Player';
import {monitorActions} from './../actions';


class Monitor extends Component {

  constructor (props) {
    super(props);
  }

  static propTypes = {
    monitor: PropTypes.object,
    archive: PropTypes.object,
    removePlayer: PropTypes.func,
  };

  prepPlayer ({ camera, width, height }) {
    let archivePeriod;
    if (!this.props.archive.multipleMode) {
      if (this.props.archive.players[camera._id]) {
        archivePeriod = this.props.archive.players[camera._id].period;
      }
    } else {
      archivePeriod = this.props.archive.period;
    }
    return (
      <Player
        key={camera._id}
        camera={camera}
        width={width}
        height={height}
        archivePeriod={archivePeriod}
        removePlayer={this.props.removePlayer}
      />
    );
  }

  prepPlayers (players = {}) {
    const cameraIds = Object.keys(players);
    if (cameraIds.length === 0) {
      return (
        <div style={{ paddingLeft: 'calc(50% - 70px)', width: 140, paddingTop: '25%', fontSize: 16 }}>
          Выберите камеру
        </div>
      );
    }
    const cameraIdsSorted = cameraIds.sort((a, b) => {
      if (players[a].positionNumber < players[b].positionNumber) {
        return -1;
      }
      if (players[a].positionNumber > players[b].positionNumber) {
        return 1;
      }
      return 0;
    });
    let compPlayers = [];
    switch (cameraIdsSorted.length) {
      case 1:
        const cameraId = cameraIdsSorted[0];
        compPlayers.push(
          this.prepPlayer({ camera: players[cameraId], width: '100%', height: '100%' })
        );
        break;
      case 2:
        compPlayers = cameraIdsSorted.map((cameraId) => {
          return (
            this.prepPlayer({ camera: players[cameraId], width: '50%', height: '100%' })
          );
        });
        break;
      case 3:
      case 4:
        compPlayers = cameraIdsSorted.map((cameraId) => {
          return (
            this.prepPlayer({ camera: players[cameraId], width: '50%', height: '50%' })
          );
        });
        break;
      case 5:
      case 6:
        compPlayers = cameraIdsSorted.map((cameraId) => {
          return (
            this.prepPlayer({ camera: players[cameraId], width: '33.33%', height: '50%' })
          );
        });
        break;
      case 7:
      case 8:
        compPlayers = cameraIdsSorted.map((cameraId) => {
          return (
            this.prepPlayer({ camera: players[cameraId], width: '25%', height: '50%' })
          );
        });
        break;
      case 9:
        compPlayers = cameraIdsSorted.map((cameraId) => {
          return (
            this.prepPlayer({ camera: players[cameraId], width: '33.33%', height: '33.33%' })
          );
        });
        break;
      case 10:
      case 11:
      case 12:
        compPlayers = cameraIdsSorted.map((cameraId) => {
          return (
            this.prepPlayer({ camera: players[cameraId], width: '25%', height: '33.33%' })
          );
        });
        break;
      case 13:
      case 14:
      case 15:
      case 16:
        compPlayers = cameraIdsSorted.map((cameraId) => {
          return (
            <Player key={cameraId} camera={players[cameraId]} width="25%" height="25%"/>
          );
        });
        break;
      default:
        break;
    }
    return (
      compPlayers.map((player) => {
        return player;
      })
    );
  }

  render () {
    return (
      <div
        style={{
          width: '100vw',
          maxWidth: '177.78vh',
          height: '56.25vw',
          maxHeight: '100vh',
          margin: 'auto',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        }}
      >
        {this.prepPlayers(this.props.monitor.players)}
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    archive: state.archive,
    monitor: state.monitor,
  };
}

export default connect(mapStateToProps, {
  removePlayer: monitorActions.removePlayer,
})(Monitor);

