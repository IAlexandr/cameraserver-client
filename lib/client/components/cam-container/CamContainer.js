import React, { PropTypes } from 'react';

import Header from './Header';
import Body from './Body';



const styleDiv = {
  boxSizing: 'content-box',
  margin: 3,
  marginBottom: 0,
  fontSize: 0,
  float: 'left',
};




const CamsContainer = ({  fullSize, children, close, properties  }) =>
  <div
    style={{ width:'100%', height:'100%', ...styleDiv }}
    tabIndex={1}
  >
    <Header close={close} properties={properties} />
    <Body children={children} />
  </div>;

CamsContainer.propTypes = {
  close: PropTypes.func,
  properties: PropTypes.object,
  fullSize: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired,
  ]),
};

export default CamsContainer;
