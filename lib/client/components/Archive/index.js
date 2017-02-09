import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {
  get as getArchive,
  setPeriod,
  switchMode,
  clearPeriod,
  togglePeriod,
  openMessage,
} from '../../actionCreators';
import Head from './Head';
import PlayersPane from './PlayersPane';

class Archive extends Component {
  constructor (props) {
    super(props);
  }

  static propTypes = {
    archive: PropTypes.object,
    monitor: PropTypes.object,
    cameracoders: PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount () {
    // this.props.getArchive();
    // this.props.loadCameracoders();
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
              cameracoders={this.props.cameracoders}
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
    cameracoders: state.cameracoders,
  };
}

export default connect(mapStateToProps, {
  getArchive,
  setPeriod,
  switchMode,
  clearPeriod,
  togglePeriod,
  openMessage,
})(Archive);
