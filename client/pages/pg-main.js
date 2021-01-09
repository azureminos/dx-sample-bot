import _ from 'lodash';
import React, {createElement} from 'react';
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
    // Sub Components
    // Display Widget
    return (
      <div>
        <div>Header - My travel plans</div>
        <div>Body - List my travel plans</div>
        <div>Footer - Create new travel plan</div>
      </div>
    );
  }
}

export default withStyles(styles)(PageAllTravel);
