import React, {Component, PropTypes} from 'react';

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

    const compPlayers = cameraIdsSorted.map((cameraId) => {
      return (
        <div key={cameraId}>
          positionNumber: {players[cameraId].positionNumber}
          <video controls/>
        </div>
      );
    });

    return (
      <div>
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
