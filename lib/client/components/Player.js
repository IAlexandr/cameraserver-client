import React, {Component, PropTypes} from 'react';
import IconButton from 'material-ui/IconButton';
import {monitorActions} from './../actions';
import {connect} from 'react-redux';
import Clear from 'material-ui/svg-icons/content/clear';
import CamContainer from './cam-container/CamContainer';
import DPalyer from './DPlayer';

class Player extends Component {
  constructor (props) {
    super(props);
  }

  static propTypes = {
    camera: PropTypes.object
  };

  render () {

    return (
      <div>
        {/*<IconButton*/}
        {/*onClick={() => {*/}
        {/*this.props.removePlayer(this.props.camera._id);*/}
        {/*}}*/}
        {/*>*/}
        {/*<Clear />*/}
        {/*</IconButton>*/}
        {/*{this.props.camera.name}*/}
        <CamContainer fullSize={false} properties={{address: this.props.camera.name}} close={() => {this.props.removePlayer(this.props.camera._id)}}>
          <DPalyer mpdUrl={'http://cs.geoworks.org/api/mpds/' + this.props.camera._id + '/mpd'} />
        </CamContainer>
      </div>
    );
  }
}

export default connect(null, {
  removePlayer: monitorActions.removePlayer,
})(Player);
