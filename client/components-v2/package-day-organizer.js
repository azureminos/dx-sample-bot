import _ from 'lodash';
import React, {createElement} from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import {withStyles} from '@material-ui/core/styles';
import ItemGrid from './item-grid';
// ====== Icons ======
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Variables
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
    // Init data
    // Setup state
    this.state = {};
  }
  // Event Handlers
  // Display Widget
  render() {
    const {classes, itemSelected, plan, planExt} = this.props;
    const {reference, actions, dayNo} = this.props;
    console.log('>>>>PackageDayOrganizer, render()', this.props);
    // Local Variables
    const day = plan.days[dayNo - 1];
    // Local Functions
    const getItem = (item, idx) => {
      const isExpand =
        (!itemSelected && idx === 0) ||
        (itemSelected && item.itemId === itemSelected);
      const handleItemPeopleChange = (val) => {
        if (actions && actions.handleItemPeopleChange) {
          actions.handleItemPeopleChange(val, dayNo, item.itemId);
        }
      };
      const itemActions = {handleItemPeopleChange};
      return (
        <Accordion expanded={isExpand} key={`${dayNo}#${item.name}`}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.heading}>{item.name}</div>
          </AccordionSummary>
          <AccordionDetails>
            <ItemGrid
              item={item}
              maxPeople={plan.totalPeople}
              reference={reference}
              actions={itemActions}
            />
          </AccordionDetails>
        </Accordion>
      );
    };
    const getAccordions = (items) => {
      const acs = [];
      _.each(items, (item, idx) => {
        acs.push(getItem(item, idx));
      });
      return acs;
    };
    // Display Widget
    return <div>{getAccordions(day.items)}</div>;
  }
}

export default withStyles(styles)(PackageDayOrganizer);
