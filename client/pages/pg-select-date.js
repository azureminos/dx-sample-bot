import _ from 'lodash';
import React, {createElement} from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import {DateRangePicker} from 'react-dates';
import {START_DATE, VERTICAL_ORIENTATION} from 'react-dates/constants';
import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
// Variables
const styles = (theme) => ({
  root: {},
});

class PageSelectDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: START_DATE,
      startDate: null,
      endDate: null,
    };
  }
  render() {
    console.log('>>>>PageSelectDate, render()', this.props);
    // Local Variables
    // Sub Components
    // Display Widget
    return (
      <div>
        <div>Header - Select travel date</div>
        <div>
          <DateRangePicker
            startDate={this.state.startDate}
            startDateId='plan_start_date'
            endDate={this.state.endDate}
            endDateId='plan_end_date'
            onDatesChange={({startDate, endDate}) =>
              this.setState({startDate, endDate})
            }
            focusedInput={this.state.focusedInput}
            onFocusChange={(focusedInput) => this.setState({focusedInput})}
            orientation={VERTICAL_ORIENTATION}
            withFullScreenPortal
            keepOpenOnDateSelect
          />
        </div>
        <div>Footer - Next</div>
      </div>
    );
  }
}

export default withStyles(styles)(PageSelectDate);
