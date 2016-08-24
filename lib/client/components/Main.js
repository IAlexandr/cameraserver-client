import React, {Component, PropTypes} from 'react';
import {smessagesActions, monitorActions} from './../actions';
import IconButton from 'material-ui/IconButton';
import Videocam from 'material-ui/svg-icons/av/videocam';
import AccessTime from 'material-ui/svg-icons/device/access-time';
import Clear from 'material-ui/svg-icons/content/clear';
import {connect} from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import Drawer from 'material-ui/Drawer';
import Cameras from './Cameras';
import Archive from './Archive';
import {Scrollbars} from 'react-custom-scrollbars';
import AppBar from 'material-ui/AppBar';

export default class Base extends Component {
  constructor (props) {
    super(props);
    this.props.getPlayers();
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
    monitor: PropTypes.object
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

  handleSmessageClose () {
    this.props.closeMessage();
  }
  prepPaneTitle () {

    switch (this.state.typeComponent) {
      case 'cameras':
        return 'Камеры';
        break;
      case 'archive':
        return 'Архив';
        break;
      default:
        break;
    }
  }
  prepPaneComponent () {

    switch (this.state.typeComponent) {
      case 'cameras':
        return (
          <Cameras />
        );
        break;
      case 'archive':
        return (<Archive />);
        break;
      default:
        break;
    }
  }

  render () {
    let children;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        players: this.props.monitor.players,
        handleLeftPaneToggle: (() => this.handleLeftPaneToggle('cameras')).bind(this)
      });
    }
    return (
      <div>
        <IconButton
          style={{ position: 'absolute', left: 10, zIndex: 99 }}
          tooltip="Список камер"
          onClick={(() => this.handleLeftPaneToggle('cameras')).bind(this)}
        >
          <Videocam />
        </IconButton>
        <IconButton
          style={{ position: 'absolute', left: 50, zIndex: 99 }}
          tooltip="Архив"
          onClick={(() => this.handleLeftPaneToggle('archive')).bind(this)}
        >
          <AccessTime />
        </IconButton>
        <Drawer
          docked={true}
          width={300}
          open={this.state.openLeftPane}
          openSecondary={false}
          onRequestChange={(open) => this.setState({ open })}
        >
          <AppBar
            showMenuIconButton={false}
            title={<span style={{ fontSize: 16 }}>{this.prepPaneTitle()}</span>}
            iconElementRight={
              <IconButton
                onClick={(() => {
                  this.setState({
                    openLeftPane: false
                  });
                }).bind(this)}
              >
                <Clear />
              </IconButton>
            }
          />
          <Scrollbars style={{ height: 'calc(100% - 64px' }}>
            {this.prepPaneComponent()}
          </Scrollbars>
        </Drawer>
        <div>
          { children }
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
    monitor: state.monitor,
  };
}

export default connect(mapStateToProps, {
  closeMessage: smessagesActions.closeMessage,
  getPlayers: monitorActions.getPlayers,
})(Base);
