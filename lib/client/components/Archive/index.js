import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {archiveActions, camerasActions, smessagesActions} from './../../actions';
import PeriodPane from './PeriodPane';
import Head from './Head';

export default class Archive extends Component {
  constructor (props) {
    super(props);
  }

  static propTypes = {
    archive: PropTypes.object,
    monitor: PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount () {
    this.props.getArchive();
  }

  render () {

    return (
      <div>
        <Head archive={this.props.archive} switchMode={this.props.switchMode}/>

        <pre>{JSON.stringify(this.props.archive, null, 2)}</pre>
        <pre>{JSON.stringify(this.props.monitor.players, null, 2)}</pre>
      </div>
    );
  };
}

function mapStateToProps (state) {
  return {
    archive: state.archive,
    monitor: state.monitor,
  };
}

export default connect(mapStateToProps, {
  getArchive: archiveActions.get,
  setPeriod: archiveActions.setPeriod,
  switchMode: archiveActions.switchMode,
  clear: archiveActions.clear,
  openMessage: smessagesActions.openMessage,
})(Archive);
