import React, {Component, PropTypes} from 'react';
import Player from './Player';

class Monitor extends Component {

  constructor (props) {
    super(props);
  }

  static propTypes = {
    players: PropTypes.object
  };

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
          <div key={cameraId} width="100%">
            <Player camera={players[cameraId]}/>
          </div>
        );
        break;
      case 2:
        compPlayers = cameraIdsSorted.map((cameraId) => {
          return (
            <div key={cameraId} style={{ width: '70%' }}>
              <Player camera={players[cameraId]}/>
            </div>
          );
        });
        break;
      case 3:
      case 4:
        compPlayers = cameraIdsSorted.map((cameraId) => {
          return (
            <div key={cameraId} style={{ width: '50%', float: 'left' }}>
              <Player camera={players[cameraId]}/>
            </div>
          );
        });
        break;
      default:
        break;
    }
    // compPlayers = cameraIdsSorted.map((cameraId) => {
    //   return (
    //     <Player key={cameraId} camera={players[cameraId]}/>
    //   );
    // });
    return (
      <div style={{ textAlign: 'center' }}>
        {compPlayers}
      </div>
    );
  }

  render () {
    return (
      <div>
        {this.prepPlayers(this.props.players)}
      </div>
    );
  }
}

export default Monitor;
