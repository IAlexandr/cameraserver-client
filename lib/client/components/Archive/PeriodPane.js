import React, {Component, PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import DatePicker from 'material-ui/DatePicker';
import areIntlLocalesSupported from 'intl-locales-supported';
import TimePicker from 'material-ui/TimePicker';
import Toggle from 'material-ui/Toggle';

let DateTimeFormat;
if (areIntlLocalesSupported(['ru'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
}

export default class PeriodPane extends Component {

  constructor (props) {
    super(props);
    this.state = {
      toggleDisabled: true
    };
  }

  static propTypes = {
    period: PropTypes.object,
    setPeriod: PropTypes.func,
    clearPeriod: PropTypes.func,
    togglePeriod: PropTypes.func,
    openMessage: PropTypes.func,
  };

  componentWillReceiveProps (nextProps) {
    this.checkPickers(nextProps.period);
  }

  prepDatePicker ({ refName, hintText, disabled, value }) {
    const onChange = (oldDate, newDate) => {
      console.log(newDate);
      let period = this.props.period;
      period[refName] = newDate;
      this.props.setPeriod({ period });
    };
    return (
      <DatePicker
        autoOk={true}
        hintText={hintText}
        DateTimeFormat={DateTimeFormat}
        container="inline"
        mode="landscape"
        cancelLabel="Отмена"
        okLabel="Ок"
        locale="ru"
        ref={refName}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    );
  }

  prepTimePicker ({ refName, hintText, disabled, value }) {
    const onChange = (oldDate, newDate) => {
      console.log(newDate);
      let period = this.props.period;
      period[refName] = newDate;
      this.props.setPeriod({ period });
    };

    return (
      <TimePicker
        format="24hr"
        hintText={hintText}
        ref={refName}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    );
  }

  checkPickers (period) {
    if (!period) {
      this.setState({
        toggleDisabled: true
      });
    } else {
      const refs = ['startDate', 'startTime', 'endDate', 'endTime'];
      let isEmpty = false;
      refs.forEach((ref) => {
        if (!period[ref]) {
          isEmpty = true;
        }
      });
      this.setState({
        toggleDisabled: isEmpty
      });
    }
  }

  render () {

    return (
      <div>
        <Paper style={{
          margin: 5,
          padding: 5,
          textAlign: 'center',
          display: 'inline-block',
          width: 'calc(100% - 10px)'
        }}>
          <div>Начало периода</div>
          {this.prepDatePicker({
            refName: 'startDate',
            hintText: 'Дата',
            disabled: this.props.period.turnedOn,
            value: this.props.period.startDate
          })}
          {this.prepTimePicker({
            refName: 'startTime',
            hintText: 'Время',
            disabled: this.props.period.turnedOn,
            value: this.props.period.startTime
          })}
        </Paper>
        <Paper style={{
          margin: 5,
          padding: 5,
          textAlign: 'center',
          display: 'inline-block',
          width: 'calc(100% - 10px)'
        }}>
          <div>Окночание периода</div>
          {this.prepDatePicker({
            refName: 'endDate',
            hintText: 'Дата',
            disabled: this.props.period.turnedOn,
            value: this.props.period.endDate
          })}
          {this.prepTimePicker({
            refName: 'endTime',
            hintText: 'Время',
            disabled: this.props.period.turnedOn,
            value: this.props.period.endTime
          })}
        </Paper>
        <Toggle
          disabled={this.state.toggleDisabled}
          label="Просмотр включен"
          labelPosition="right"
          defaultToggled={this.props.period.turnedOn}
          onToggle={(e, isToggleOn) => {
            this.props.togglePeriod({ isToggleOn });
          }}
          style={{ margin: 20 }}
        />
      </div>
    );
  }
}