import React, {Component, PropTypes} from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import PeriodPane from './PeriodPane';
import moment from 'moment';
import LinearProgress from 'material-ui/LinearProgress';

export default class PlayersPane extends Component {
  constructor (props) {
    super(props);
  }

  static propTypes = {
    archive: PropTypes.object,
    players: PropTypes.object,
    cameracoders: PropTypes.object,
    switchMode: PropTypes.func,
    setPeriod: PropTypes.func,
    clearPeriod: PropTypes.func,
    togglePeriod: PropTypes.func,
    openMessage: PropTypes.func,
  };

  prepSubtitle (cameracoder) {
    let isWorking = '';
    let startTime = '';
    let stopTime = '';
    if (cameracoder.hasOwnProperty('isWorking')) {
      if (cameracoder.isWorking) {
        isWorking = 'Ведется запись'
      } else {
        if (cameracoder.stoppedAt) {
          isWorking = 'Запись велась';
          stopTime = (<div>по {moment(cameracoder.stoppedAt).format('DD-MM-YYYY HH:mm:ss')}</div>);
        }
      }
    }
    if (cameracoder.startedAt) {
      startTime = (<div>с {moment(cameracoder.startedAt).format('DD-MM-YYYY HH:mm:ss')}</div>);
    }

    return (<div>{isWorking}<br/>{startTime}{stopTime}</div>);
  }

  prepCard ({player, cameracoder = {}}) {
    let playerPeriod = {};
    let cardStyle = {};
    if (this.props.archive.players[player._id]) {
      playerPeriod = this.props.archive.players[player._id].period;
      if (playerPeriod.turnedOn) {
        cardStyle = {background: '#DAF270'};
      }
    }
    let subTitle;
    if (cameracoder.hasOwnProperty('startedAt')) {
      subTitle = this.prepSubtitle(cameracoder);
    }

    return (
      <Card style={{ padding: 5 }}>
        <CardHeader
          title={player.address}
          subtitle={subTitle}
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
    const { players, cameracoders } = this.props;
    let result;
    if (cameracoders.loading) {
      result = (<LinearProgress mode="indeterminate"/>);
    } else {
      result = Object.keys(players).map((cameraId) => {

        return (
          <div key={cameraId}>
            {this.prepCard({ player: players[cameraId], cameracoder: cameracoders.data[cameraId] })}
          </div>
        );
      });
    }
    return result;
  }

  render () {
    return (
      <div>
        {this.prepPlayersCards()}
      </div>
    );
  }
}
