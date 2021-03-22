import _ from 'lodash';
import React, {createElement} from 'react';
import Carousel from 'react-multi-carousel';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ItemCard from './item-card';
import {withStyles} from '@material-ui/core/styles';
import CONSTANTS from '../../lib/constants';
// ====== Icons ======
// Variables
const {TravelPlanItemType} = CONSTANTS.get().DataModel;
const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  divTitleRoot: {
    display: 'flex',
    alignItems: 'center',
  },
  divTitleItem: {
    margin: 4,
  },
  fBtnRoot: {
    margin: 4,
  },
});

class PackageDayOrganizer extends React.Component {
  constructor(props) {
    super(props);
    // Bind event handlers
    // this.doHandleSelectCity = this.doHandleSelectCity.bind(this);
    // Init data
    // Setup state
    this.state = {};
  }
  // Event Handlers
  /* doHandleSelectCity(city) {
    // console.log('>>>>PackageDayOrganizer.doHandleSelectCity');
    this.setState({selectedCity: city});
  }*/
  // Display Widget
  render() {
    const {classes, plan, planExt} = this.props;
    const {reference, actions, daySelected} = this.props;
    console.log('>>>>PackageDayOrganizer, render()', {plan, daySelected});
    // Local Variables
    const day = plan.days[daySelected - 1];
    // Local Functions
    // Display Widget
    return <div>Day Organizer</div>;
  }
}

export default withStyles(styles)(PackageDayOrganizer);
