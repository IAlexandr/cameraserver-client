import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import Camera from './Camera';

export default class Player extends Component {
  static propTypes = {
    camera: PropTypes.object,
    archivePeriod: PropTypes.object,
    width: PropTypes.string,
    height: PropTypes.string,
    removePlayer: PropTypes.func,
  };

  prepArchiveQuery ({startDate, startTime, endDate, endTime}) {
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

    return `?startDate=${startPeriod.valueOf()}&endDate=${endPeriod.valueOf()}`;
  }

  prepMpdUrl () {
    let query = '';
    if (this.props.archivePeriod && this.props.archivePeriod.turnedOn) {
      query = this.prepArchiveQuery(this.props.archivePeriod);
    }
    return '/api/streams/' + this.props.camera.id + '/manifest.mpd' + query;
  }

  render () {
    return (
        <Camera
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
