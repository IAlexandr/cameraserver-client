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
  static propTypes = {
    period: PropTypes.object,
    setPeriod: PropTypes.func,
    clearPeriod: PropTypes.func,
    togglePeriod: PropTypes.func,
    openMessage: PropTypes.func,
  };

  prepDatePicker ({ refName, hintText }) {

    return (
      <DatePicker
        hintText={hintText}
        DateTimeFormat={DateTimeFormat}
        container="inline"
        mode="landscape"
        cancelLabel="Отмена"
        okLabel="Ок"
        locale="ru"
        ref={refName}
      />
    );
  }

  prepTimePicker ({ refName, hintText }) {

    return (
      <TimePicker
        format="24hr"
        hintText={hintText}
        ref={refName}
        onChange={
          (oldDate, newDate) => {
            console.log(newDate);
          }
        }
      />
    );
  }

  prepButtons () {
    if (this.props.period.turnedOn) {
      return (<RaisedButton label="Остановить" secondary={true} style={{ margin: 5 }}/>);
    } else {
      return (<RaisedButton label="Включить" primary={true} style={{ margin: 5 }}/>);
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
          {this.prepDatePicker({ refName: 'startDate', hintText: 'Дата' })}
          {this.prepTimePicker({ refName: 'startTime', hintText: 'Время' })}
        </Paper>
        <Paper style={{
          margin: 5,
          padding: 5,
          textAlign: 'center',
          display: 'inline-block',
          width: 'calc(100% - 10px)'
        }}>
          <div>Окночание периода</div>
          {this.prepDatePicker({ refName: 'endDate', hintText: 'Дата' })}
          {this.prepTimePicker({ refName: 'endTime', hintText: 'Время' })}
        </Paper>
        <Toggle
          label="Просмотр включен"
          labelPosition="right"
          defaultToggled={this.props.period.turnedOn}
          onToggle={this.props.togglePeriod}
          style={{ margin: 20 }}
        />
      </div>
    );
  }
}
