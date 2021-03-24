// Components
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import CONSTANTS from '../../lib/constants';
// Styles
// Variables
const {ATTRACTION, PRODUCT} = CONSTANTS.get().DataModel.TravelPlanItemType;
const styles = (theme) => ({
  root: {},
});

class AttractionGrid extends React.Component {
  constructor(props) {
    super(props);
    // Bind event handlers
    // Init data
    // Setup state
    this.state = {};
  }
  // Event Handlers
  // Display Widget
  render() {
    // console.log('>>>>AttractionGrid.render', this.props);
    // Local Variables
    const {classes, item, type, isSelected, dayNo} = this.props;
    // Sub Widget
    // Display Widget
    return <div>Hello</div>;
  }
}

export default withStyles(styles, {withTheme: true})(AttractionGrid);
