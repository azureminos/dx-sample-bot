import _ from 'lodash';
import React, {createElement} from 'react';
import {DateRangePicker, constants} from 'react-dates';
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
      focusedInput: constants.START_DATE,
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
            orientation={constants.VERTICAL_ORIENTATION}
            keepOpenOnDateSelect
          />
        </div>
        <div>Footer - Next</div>
      </div>
    );
  }
}

export default withStyles(styles)(PageSelectDate);
