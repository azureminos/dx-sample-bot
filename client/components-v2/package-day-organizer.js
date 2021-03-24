import _ from 'lodash';
import React, {createElement} from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import {withStyles} from '@material-ui/core/styles';
import ProductGrid from '../components-v2/product-grid';
import AttractionGrid from '../components-v2/attraction-grid';
import CONSTANTS from '../../lib/constants';
// ====== Icons ======
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
    this.changeTab = this.changeTab.bind(this);
    // Init data
    // Setup state
    this.state = {
      selectedItem: '',
    };
  }
  // Event Handlers
  changeTab(name) {
    console.log('>>>>PackageDayOrganizer.changeTab', name);
    this.setState({selectedItem: name});
  }
  // Display Widget
  render() {
    const {classes, plan, planExt} = this.props;
    const {reference, actions, dayNo} = this.props;
    const {selectedItem} = this.state;
    console.log('>>>>PackageDayOrganizer, render()', {plan, dayNo});
    // Local Variables
    const day = plan.days[dayNo - 1];
    // Local Functions
    const getItem = (item) => {
      return (
        <Accordion
          key={`${dayNo}#${item.name}`}
          expanded={selectedItem === item.name}
          onChange={this.changeTab(item.name)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.heading}>{item.name}</div>
            <div className={classes.heading}>Secondary Widget</div>
          </AccordionSummary>
          <AccordionDetails>
            {item ? <ProductGrid /> : <AttractionGrid />}
          </AccordionDetails>
        </Accordion>
      );
    };
    // Display Widget
    return (
      <div>
        {_.map(day.items, (it) => {
          return getItem(it);
        })}
      </div>
    );
  }
}

export default withStyles(styles)(PackageDayOrganizer);
