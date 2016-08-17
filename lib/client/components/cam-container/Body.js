import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';

const styleBody = {
  height: 'calc(100% - 20px)',
  width: '100%',
  margin: 0,
  textAlign: 'center',
  display: 'inline-block',
};

const Body = ({ children }) =>
  <Paper style={styleBody} zDepth={1} >
    {children}
  </Paper>;

Body.propTypes = {
  children: PropTypes.object.isRequired,
};


export default Body;
