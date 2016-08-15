import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

const stylePaper = {
  height: 16,
  width: 16,
  position: 'relative',
};

const styleIcon = {
  height: 16,
  width: 16,
};

const Icon = ({ children, style, onClick }) =>
  <Paper style={{ ...stylePaper, ...style }} zDepth={1} onClick={onClick} >
    <IconButton iconStyle={styleIcon} style={{ ...styleIcon, padding: 0 }}>
      {children}
    </IconButton>
  </Paper>;

Icon.propTypes = {
  children: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Icon;
