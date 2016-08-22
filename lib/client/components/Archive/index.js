import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {archiveActions, camerasActions, smessagesActions} from './../../actions';
import Head from './Head';
import PlayersPane from './PlayersPane';

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
        <Head
          archive={this.props.archive}
          switchMode={this.props.switchMode}
          setPeriod={this.props.setPeriod}
          clearPeriod={this.props.clearPeriod}
          togglePeriod={this.props.togglePeriod}
          openMessage={this.props.openMessage}
        />
        {
          this.props.archive.multipleMode ?
            null :
            (<PlayersPane
              archive={this.props.archive}
              players={this.props.monitor.players}
              switchMode={this.props.switchMode}
              setPeriod={this.props.setPeriod}
              clearPeriod={this.props.clearPeriod}
              togglePeriod={this.props.togglePeriod}
              openMessage={this.props.openMessage}
            />)
        }
        {/*<pre>*/}
          {/*{JSON.stringify(this.props.archive, null, 2)}*/}
        {/*</pre>*/}
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
  clearPeriod: archiveActions.clear,
  togglePeriod: archiveActions.togglePeriod,
  openMessage: smessagesActions.openMessage,
})(Archive);
