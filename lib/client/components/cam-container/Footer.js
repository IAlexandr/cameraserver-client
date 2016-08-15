import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';


const styleFooter = {
  height: 38,
};




const Footer = () =>
  <Paper style={styleFooter} zDepth={1} >

  </Paper>;

Footer.propTypes = {
  history: PropTypes.bool.isRequired,
  properties: PropTypes.object.isRequired,
  handleHistory: PropTypes.func.isRequired,
};



export default Footer;
