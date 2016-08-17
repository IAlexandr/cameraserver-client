import React, {Component, PropTypes} from 'react';
import DPlayer from './DPlayer';
import moment from 'moment';

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
      <div style={{
        width: this.props.width,
        height: this.props.height,
        float: 'left',
        margin: 0,
        padding: 0
      }}>
        <DPlayer mpdUrl={this.prepMpdUrl()} properties={this.props.camera} />
      </div>
    );
  }
}
