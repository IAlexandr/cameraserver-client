import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {archiveActions, smessagesActions} from './../../actions';

export default class Archive extends Component {
  constructor (props) {
    super(props);

  }

  static propTypes = {
    cameras: PropTypes.object,

  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render () {

    return (
      <div>
        Archive!!
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
  get: archiveActions.get,
  setPeriod: archiveActions.setPeriod,
  switchMode: archiveActions.switchMode,
  clear: archiveActions.clear,
  openMessage: smessagesActions.openMessage,
})(Archive);
