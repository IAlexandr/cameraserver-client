import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import Paper from 'material-ui/Paper';
import DynaTable from '../utils/DynaTable';
import {
  loadCameras,
  getPlayers,
  addPlayer,
  removePlayer,
  openMessage
} from '../actionCreators';

const styles = {
  paper: {
    margin: 5,
    padding: 5,
    textAlign: 'center',
    display: 'inline-block',
  },
  paperArchive: {
    margin: 5,
    padding: 5,
    textAlign: 'center',
    display: 'inline-block',
  },
};

class Cameras extends Component {
  constructor (props) {
    super(props);
    this.state = {
      camerasTable: (<div></div>)
    }
  }

  static propTypes = {
    cameras: PropTypes.object,
    monitor: PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount () {
    this.props.loadCameras();
    this.prepCamerasTable(this.props.cameras);
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.cameras.loading) {
      this.prepCamerasTable(nextProps.cameras);
    }
  }

  playerToggle (camera) {
    const cameraId = camera.id;
    if (this.props.monitor.players.hasOwnProperty(cameraId)) {
      this.props.removePlayer(cameraId);
    } else {
      if (Object.keys(this.props.monitor.players).length >= 16) {
        this.props.openMessage('Открыто максимальное количество камер.');
      } else {
        this.props.addPlayer(camera);
      }
    }
  }

  prepCamerasTable (cameras) {
    const _this = this;
    let component;
    const buttons = [];
    const dataKeys = Object.keys(cameras.data);
    if (cameras.loading) {
      component = (
        <LinearProgress mode="indeterminate"/>
      );
    } else {
      const definition = {
        columns: {
          'address': {
            alias: 'Адрес',
            order: 1,
            prepRowStyle: (obj) => {
              if (_this.props.monitor.players.hasOwnProperty(obj.id)) {
                return {
                  cursor: 'pointer',
                  color: 'green'
                };
              }
              return {
                cursor: 'pointer'
              };
            }
          }
        },
        showExpression: (obj) => {
          return true; // TODO сделать фильтр
        },
        onCellClick (selectedIndex) {
          const camera = cameras.data[dataKeys[selectedIndex]];
          _this.playerToggle(camera);
        }
      };

      component = (
        <DynaTable
          definition={definition}
          data={Object.keys(cameras.data).map((cameraId) => {
            return cameras.data[cameraId]
          })}
        />
      );
    }
    this.setState({
      camerasTable: component
    });
  };

  render () {

    if (this.props.children) {
      return React.cloneElement(this.props.children, {
        loading: this.props.cameras.loading,
        camera: this.props.cameras.data[this.props.params.cameraId] || {},
        cameraTypes: this.props.cameraTypes || {},
        saveAction: this.props.upsertCamera,
        deleteAction: this.props.deleteCamera,
      });
    }
    return (
      <div style={{ height: '100%', textAlign: 'center' }}>
        <Paper style={styles.paper} zDepth={1}>
          {this.state.camerasTable}
        </Paper>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cameras: state.cameras,
    monitor: state.monitor,
  };
}

export default connect(mapStateToProps, {
  loadCameras,
  getPlayers,
  addPlayer,
  removePlayer,
  openMessage
})(Cameras);
