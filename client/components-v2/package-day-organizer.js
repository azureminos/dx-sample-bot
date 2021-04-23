import _ from 'lodash';
import React, {createElement} from 'react';
import {Element, scroller} from 'react-scroll';
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
    this.handleAccordion = this.handleAccordion.bind(this);
    // Init data
    const day = this.props.plan.days[this.props.dayNo - 1];
    const fstItemId =
      day.items && day.items.length > 0 ? day.items[0].itemId : '';
    // Setup state
    this.state = {
      itemSelected: this.props.itemSelected
        ? this.props.itemSelected
        : fstItemId,
    };
  }
  componentDidMount() {
    const {itemSelected} = this.state;
    scroller.scrollTo(`myScroll#${itemSelected}`, {
      duration: 0,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -60,
    });
  }
  componentDidUpdate() {
    const {itemSelected} = this.state;
    scroller.scrollTo(`myScroll#${itemSelected}`, {
      duration: 0,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -60,
    });
  }
  // Event Handlers
  handleAccordion(itemId) {
    const {itemSelected} = this.state;
    this.setState({itemSelected: itemId === itemSelected ? '' : itemId});
  }
  // Display Widget
  render() {
    const {classes, plan, planExt} = this.props;
    const {reference, actions, dayNo} = this.props;
    console.log('>>>>PackageDayOrganizer, render()', this.props);
    // Local Variables
    const day = plan.days[dayNo - 1];
    // Local Functions
    const getItem = (item) => {
      const {itemSelected} = this.state;
      const isExpand = item.itemId === itemSelected;
      const handleItemPeopleChange = (val) => {
        if (actions && actions.handleItemPeopleChange) {
          actions.handleItemPeopleChange(val, dayNo, item.itemId);
        }
      };
      const itemActions = {handleItemPeopleChange};
      return (
        <Accordion expanded={isExpand} key={`${dayNo}#${item.name}`}>
          <AccordionSummary
            onClick={() => {
              this.handleAccordion(item.itemId);
            }}
            expandIcon={<ExpandMoreIcon />}
          >
            <div className={classes.heading}>
              <Element name={`myScroll#${item.itemId}`}>{item.name}</Element>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <ItemGrid
              item={item}
              maxPeople={plan.totalPeople}
              reference={reference}
              actions={itemActions}
              defaultClick={isExpand}
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
