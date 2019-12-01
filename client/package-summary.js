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
    const {classes, userId, pushToRemote} = this.props;
    console.log('>>>>PackageSummary, render()', {userId});
    // Local Variables
    // Sub Components
    // Display Widget
    return <div>Hello Package Summary</div>;
  }
}

export default withStyles(styles)(PackageSummary);
