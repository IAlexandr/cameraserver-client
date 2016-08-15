import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import styles from './../../utils/styles';
import DynaTable from './../../utils/DynaTable';
import {camerasActions} from './../../actions';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

class Cameras extends Component {
  constructor (props) {
    super(props);

  }

  static propTypes = {
    cameras: PropTypes.object,
    players: PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.loadCameras();
  }

  prepCamerasTable () {
    let component;
    const buttons = [];
    if (this.props.cameras.loading) {
      component = (
        <LinearProgress mode="indeterminate"/>
      );
    } else {
      const cameras = this.props.cameras;
      const definition = {
        columns: {
          'name': {
            alias: 'Камеры по адресам',
            order: 1
          }
        },
        showExpression: (obj) => {
          return true; // TODO сделать фильтр
        }
      };

      component = (
        <DynaTable
          definition={definition}
          data={Object.keys(cameras.data).map((cameraId) => { return cameras.data[cameraId]})}
        />
      );
    }
    return (
      <div>
        {component}
      </div>
    );
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
          {this.prepCamerasTable()}
        </Paper>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    cameras: state.cameras,
  };
}

export default connect(mapStateToProps, {
  loadCameras: camerasActions.loadCameras,
})(Cameras);
