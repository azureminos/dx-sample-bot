import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
// Variables
const styles = (theme) => ({
  root: {},
});

class PageSelectDestination extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('>>>>PageSelectDestination, render()', this.props);
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

export default withStyles(styles)(PageSelectDestination);
