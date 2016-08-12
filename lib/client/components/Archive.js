import React, {Component, PropTypes} from 'react';

export default class Archive extends Component {
  constructor (props) {
    super(props);

  }

  static propTypes = {
    cameras: PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render () {

    return (
      <div>
        Archive!!
      </div>
    );
  };
}
