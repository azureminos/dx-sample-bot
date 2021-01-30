import _ from 'lodash';
import React, {createElement} from 'react';
import {Element, scroller} from 'react-scroll';
import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
// Variables
const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class PackageDayPlanner extends React.Component {
  constructor(props) {
    super(props);
    // Bind event handlers
    // Init data
    // Setup state
  }
  /* componentDidMount() {
    scroller.scrollTo('myScrollToElement', {
      duration: 0,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -50,
    });
  }*/
  // Event Handlers
  // Display Widget
  render() {
    const {classes, plan, planExt, reference, actions} = this.props;
    console.log('>>>>PackageDayPlanner, render()', {});
    // Local Variables
    // Sub Components
    // Display Widget
    return <div>trip plan</div>;
  }
}

export default withStyles(styles)(PackageDayPlanner);
