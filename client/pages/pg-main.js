import _ from 'lodash';
import React, {createElement} from 'react';
import PlanCard from '../components-v2/plan-card';
import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
// Variables
const styles = (theme) => ({
  root: {},
});

class PageAllTravel extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('>>>>PageAllTravel, render()', this.props);
    // Local Variables
    const {classes, plans, actions} = this.props;
    const divPlans = _.map(plans, (p, idx) => {
      return (
        <PlanCard
          key={idx}
          plan={p}
          handleClickCard={actions.handleClickPlanCard}
        />
      );
    });
    // Sub Components
    // Display Widget
    return <div className={classes.root}>{divPlans}</div>;
  }
}

export default withStyles(styles)(PageAllTravel);
