import React, {Component, PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import styles from './../../utils/styles';
import Checkbox from 'material-ui/Checkbox';
import Timelapse from 'material-ui/svg-icons/image/timelapse';
import PeriodPane from './PeriodPane';

export default class Head extends Component {
  static propTypes = {
    archive: PropTypes.object,
    switchMode: PropTypes.func,
    setPeriod: PropTypes.func,
    clearPeriod: PropTypes.func,
    togglePeriod: PropTypes.func,
    openMessage: PropTypes.func,
  };

  render () {

    return (
      <Paper style={styles.paperArchive}>
        <Checkbox
          checkedIcon={<Timelapse style={{ width: 48, height: 48 }}/>}
          uncheckedIcon={<Timelapse style={{ width: 48, height: 48 }}/>}
          defaultChecked={this.props.archive.multipleMode}
          labelPosition='left'
          label="Просмотр архива по всем камерам за один период времени"
          style={{ marginTop: 10 }}
          iconStyle={{ marginLeft: 0, width:0, height:0 }}
          onCheck={((e, isInputChecked) => {
            console.log('isInputChecked:', isInputChecked);
            if (!isInputChecked) {
              this.props.togglePeriod({isToggleOn: false});
            }
            this.props.switchMode();
          }).bind(this)}
        />
        {
          this.props.archive.multipleMode ? (
            <div>
              <br />
              <PeriodPane
                period={this.props.archive.period}
                setPeriod={() => {
                  this.props.setPeriod(); // TODO cameraId
                }}
                clearPeriod={this.props.clearPeriod}
                togglePeriod={this.props.togglePeriod}
                openMessage={this.props.openMessage}
              />
            </div>) : null
        }
      </Paper>
    );
  }
}
