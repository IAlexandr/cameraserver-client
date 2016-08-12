import React, { Component, PropTypes } from 'react';
import {smessagesActions, camerasActions} from './../actions';
import IconButton from 'material-ui/IconButton';
import Videocam from 'material-ui/svg-icons/av/videocam';
import AccessTime from 'material-ui/svg-icons/device/access-time';
import Clear from 'material-ui/svg-icons/content/clear';
import {connect} from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import Drawer from 'material-ui/Drawer';
import Cameras from './Cameras';
import Archive from './Archive';

export default class Base extends Component {
  constructor (props) {
    super(props);
    this.props.loadCameras();
    this.state = {
      openLeftPane: false
    }
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]),
    cameras: PropTypes.object
  };

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  handleLeftPaneToggle (typeComponent) {
    this.setState({
      openLeftPane: !this.state.openLeftPane,
      typeComponent: typeComponent
    });
  }

  goTo (route) {
    return () => {
      this.setState({ openLeftPane: false });
      this.context.history.push(route);
    }
  }

  handleSmessageClose() {
    this.props.closeMessage();
  }

  prepPaneComponent () {

    switch (this.state.typeComponent) {
      case 'cameras':
        return (<Cameras />);
        break;
      case 'archive':
        return (<Archive />);
        break;
      default:
        break;
    }
  }

  render () {
    return (
      <div>
        <IconButton
          tooltip="Список камер"
          onClick={(() => this.handleLeftPaneToggle('cameras')).bind(this)}
        >
          <Videocam />
        </IconButton>
        <IconButton
          tooltip="Архив"
          onClick={(() => this.handleLeftPaneToggle('archive')).bind(this)}
        >
          <AccessTime />
        </IconButton>
        <Drawer
          docked={false}
          width={300}
          open={this.state.openLeftPane}
          openSecondary={false}
          onRequestChange={(open) => this.setState({ open })}
        >
          <IconButton
            tooltip="Закрыть"
            onClick={(() => {
              this.setState({
                openLeftPane: false
              });
            }).bind(this)}
          >
            <Clear />
          </IconButton>
          {this.prepPaneComponent()}
        </Drawer>
        <div>
          { this.props.children }
        </div>
        <Snackbar
          open={this.props.sOpen}
          message={this.props.sMessage}
          onRequestClose={this.handleSmessageClose.bind(this)}
        />
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    sMessage: state.smessages.message,
    sOpen: state.smessages.open,
  };
}

export default connect(mapStateToProps, {
  closeMessage: smessagesActions.closeMessage,
  loadCameras: camerasActions.loadCameras,
})(Base);
