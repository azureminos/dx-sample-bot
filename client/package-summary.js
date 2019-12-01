import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
// Variables
const styles = (theme) => ({
  root: {},
});

class PackageSummary extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('>>>>PackageSummary, render()', this.props);
    const {classes, userId, pushToRemote} = this.props;
    // Local Variables
    // Sub Components
    // Display Widget
    return <div>Hello Package Summary</div>;
  }
}

export default withStyles(styles)(PackageSummary);
