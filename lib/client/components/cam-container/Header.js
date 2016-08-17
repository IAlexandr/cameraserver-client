/* eslint-disable no-underscore-dangle */

import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import Icon from './Icon';

import IconClose from 'material-ui/svg-icons/content/clear';
import IconFull from 'material-ui/svg-icons/navigation/fullscreen';

const style = {
  paper: {
    height: 20,
  },
  icon: {
    marginRight: 8,
    top: 1,
    float: 'left',
  },
  span: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 500,
  },
};



const Header = ({close, properties}) =>
  <Paper style={style.paper} zDepth={1} >
    <span style={style.span}>{properties.name}</span>
    <div style={{ float: 'right' }}>
      {/*<Icon*/}
        {/*style={style.icon}*/}
        {/*onClick={() => {}}*/}
      {/*>*/}
        {/*<IconFull />*/}
      {/*</Icon>*/}
      <Icon
        style={style.icon}
        onClick={close}
      >
        <IconClose />
      </Icon>
    </div>
  </Paper>;

Header.propTypes = {
};

export default Header;
