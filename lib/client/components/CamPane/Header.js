import React, {PropTypes} from 'react';
import style  from './style';
import IconClose from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';

const Header = ({ close, properties, period }) =>
  <div
    style={style.vheader}
  >
    <div style={style['vheader-left']}></div>
    <div style={style['vheader-center']}>
      <div style={style['vheader-title']}>
        {properties.name}
      </div>
      <div style={style['vheader-time']}>
        15:41:33
      </div>
    </div>
    <div style={style['vheader-right']}>
      <IconButton
        style={{position: 'absolute', right: 5, zIndex: 99999 }}
        onClick={() => {
          close();
        }}
      >
        <IconClose />
      </IconButton>
    </div>
  </div>;

Header.propTypes = {
  close: PropTypes.func,
  properties: PropTypes.object,
  period: PropTypes.object,
};

export default Header;
