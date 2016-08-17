import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {archiveActions, camerasActions, smessagesActions} from './../../actions';

export default class Archive extends Component {
  constructor (props) {
    super(props);
    this.props.getArchive();
  }

  static propTypes = {
    archive: PropTypes.object,
    players: PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render () {

    return (
      <div>
        <pre>{JSON.stringify(this.props.archive, null, 2)}</pre>
        <pre>{JSON.stringify(this.props.players, null, 2)}</pre>
      </div>
    );
  };
}

function mapStateToProps (state) {
  return {
    archive: state.archive,
  };
}

export default connect(mapStateToProps, {
  getArchive: archiveActions.get,
  setPeriod: archiveActions.setPeriod,
  switchMode: archiveActions.switchMode,
  clear: archiveActions.clear,
  openMessage: smessagesActions.openMessage,
})(Archive);
