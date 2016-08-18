import React, {Component, PropTypes} from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import PeriodPane from './PeriodPane';

export default class PlayersPane extends Component {
  constructor (props) {
    super(props);
  }

  static propTypes = {
    archive: PropTypes.object,
    players: PropTypes.object,
    switchMode: PropTypes.func,
    setPeriod: PropTypes.func,
    clearPeriod: PropTypes.func,
    togglePeriod: PropTypes.func,
    openMessage: PropTypes.func,
  };

  prepCard (player) {
    let playerPeriod = {};
    let cardStyle = {};
    if (this.props.archive.players[player._id]) {
      playerPeriod = this.props.archive.players[player._id].period;
      if (playerPeriod.turnedOn) {
        cardStyle = {background: '#DAF270'};
      }
    }
    return (
      <Card style={{ padding: 5 }}>
        <CardHeader
          title={player.name}
          actAsExpander={true}
          showExpandableButton={true}
          style={cardStyle}
        />
        <PeriodPane
          expandable={true}
          period={playerPeriod}
          setPeriod={({period}) => {
            this.props.setPeriod({ period, cameraId: player._id });
          }}
          clearPeriod={(period) => {
            this.props.clearPeriod({ period, cameraId: player._id });
          }}
          togglePeriod={({isToggleOn}) => {
            this.props.togglePeriod({ isToggleOn, cameraId: player._id });
          }}
          openMessage={this.props.openMessage}
        />
      </Card>
    );
  }

  prepPlayersCards () {
    const { players } = this.props;
    return Object.keys(players).map((cameraId) => {

      return (
        <div key={cameraId}>
          {this.prepCard(players[cameraId])}
        </div>
      );
    });
  }

  render () {
    return (
      <div>
        {this.prepPlayersCards()}
      </div>
    );
  }
}
