import React, {Component, PropTypes} from 'react';
import CamPane from './CamPane';
import {monitorActions} from './../actions';
import moment from 'moment';
import {connect} from 'react-redux';

export default class Player extends Component {
  static propTypes = {
    camera: PropTypes.object,
    archivePeriod: PropTypes.object,
    width: PropTypes.string,
    height: PropTypes.string,
  };

  prepArchiveQuery ({ startDate, startTime, endDate, endTime}) {
    const startPeriod = moment(startDate);
    startTime = moment(startTime);
    startPeriod.hour(startTime.hour());
    startPeriod.minute(startTime.minute());
    startPeriod.second(0);
    const endPeriod = moment(endDate);
    endTime = moment(endTime);
    endPeriod.hour(endTime.hour());
    endPeriod.minute(endTime.minute());
    endPeriod.second(0);
    return '?' + 'startTime=' + startPeriod.toISOString() + '&endTime=' + endPeriod.toISOString();
  }

  prepMpdUrl () {
    let query = '';
    if (this.props.archivePeriod && this.props.archivePeriod.turnedOn) {
      query = this.prepArchiveQuery(this.props.archivePeriod);
    }
    return '/api/cameras/' + this.props.camera._id + '/mpd' + query;
  }

  render () {
    return (
        <CamPane
          mpdUrl={this.prepMpdUrl()}
          close={this.props.removePlayer}
          properties={this.props.camera}
          period={this.props.archivePeriod}
          width={this.props.width}
          height={this.props.height}
        />
    );
  }
}

export default connect(null, {
  removePlayer: monitorActions.removePlayer,
})(Player);
