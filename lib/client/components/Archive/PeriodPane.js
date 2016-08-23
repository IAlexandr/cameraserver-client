import React, {Component, PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import DatePicker from 'material-ui/DatePicker';
import areIntlLocalesSupported from 'intl-locales-supported';
import TimePicker from 'material-ui/TimePicker';
import Toggle from 'material-ui/Toggle';
import moment from 'moment';

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
    cameracoder: PropTypes.object,
    setPeriod: PropTypes.func,
    clearPeriod: PropTypes.func,
    togglePeriod: PropTypes.func,
    openMessage: PropTypes.func,
  };

  componentDidMount () {
    this.checkPickers(this.props.period);
  }

  componentWillReceiveProps (nextProps) {
    this.checkPickers(nextProps.period);
  }

  prepDatePicker ({ refName, hintText, disabled, value }) {
    const onChange = (oldDate, newDate) => {
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
    const refs = ['startDate', 'startTime', 'endDate', 'endTime'];
    let isEmpty = false;
    let newPeriod = {};
    refs.forEach((ref) => {
      if (!this.refs[ref]) {
        isEmpty = true;
      } else {
        if (period && Object.keys(period).length <= 1) {
          if (this.refs[ref]) {
            if (this.refs[ref].state.date) {
              newPeriod[ref] = this.refs[ref].state.date;
            }
            if (this.refs[ref].state.time) {
              newPeriod[ref] = this.refs[ref].state.time;
            }
          }
        }
      }
    });

    if (period && Object.keys(period).length  <= 1) {
      this.props.setPeriod({ period: newPeriod });
    }
    this.setState({
      toggleDisabled: isEmpty
    });
  }

  prepStartValue (startDate) {
    if (!startDate) {
      // TODO вычислять относительно периода записи this.props.cameracoder.startedAt
      const dt = moment(new Date()).subtract(1, 'hours');
      return dt._d;
    } else {
      return startDate;
    }
  }

  prepEndValue (endDate) {
    if (!endDate) {
      // TODO вычислять относительно периода записи this.props.cameracoder.startedAt
      const dt = moment(new Date()).subtract(10, 'seconds');
      return dt._d;
    } else {
      return endDate;
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
            value: this.prepStartValue(this.props.period.startDate)
          })}
          {this.prepTimePicker({
            refName: 'startTime',
            hintText: 'Время',
            disabled: this.props.period.turnedOn,
            value: this.prepStartValue(this.props.period.startTime)
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
            value: this.prepEndValue(this.props.period.endDate)
          })}
          {this.prepTimePicker({
            refName: 'endTime',
            hintText: 'Время',
            disabled: this.props.period.turnedOn,
            value: this.prepEndValue(this.props.period.endTime)
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
