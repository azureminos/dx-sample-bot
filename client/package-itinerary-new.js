import _ from 'lodash';
import React, {createElement} from 'react';
import Moment from 'moment';
import {withStyles} from '@material-ui/core/styles';
import CONSTANTS from '../lib/constants';

const {Global, Instance} = CONSTANTS.get();
const InstanceStatus = Instance.status;

const styles = (theme) => ({
  root: {
    width: '100%',
  },
});
class PackageItineraryNew extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    // Init data
    // Setup state
    this.state = {};
  }
  // Event Handlers
  // Display Widget
  render() {
    console.log('>>>>PackageItineraryNew, Start render with props', this.props);
    // Local variables
    // Sub Widgets

    return <div>PackageItineraryNew</div>;
  }
}

export default withStyles(styles, {withTheme: true})(PackageItineraryNew);
