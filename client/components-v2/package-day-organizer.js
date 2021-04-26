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
    this.handleAccordion = this.handleAccordion.bind(this);
    this.handleClickTraveler = this.handleClickTraveler.bind(this);
    this.doHandleItemPeopleChange = this.doHandleItemPeopleChange.bind(this);
    this.executeScroll = this.executeScroll.bind(this);
    // Init data
    this.myRef = React.createRef();
    const day = this.props.plan.days[this.props.dayNo - 1];
    const fstItemId =
      day.items && day.items.length > 0 ? day.items[0].itemId : '';
    const popover = {};
    _.each(day.items, (it) => {
      popover[it.itemId] = !!(
        this.props.itemSelected && this.props.itemSelected === it.itemId
      );
    });
    // Setup state
    this.state = {
      itemSelected: this.props.itemSelected
        ? this.props.itemSelected
        : fstItemId,
      popover: popover,
    };
  }
  componentDidMount() {
    this.executeScroll();
  }
  componentDidUpdate() {
    this.executeScroll();
  }
  // Event Handlers
  executeScroll() {
    if (this.myRef && this.myRef.current) {
      this.myRef.current.scrollIntoView();
    }
  }
  handleClickTraveler(itemId, isOpen) {
    const {popover} = this.state;
    popover[itemId] = isOpen;
    this.setState({popover});
  }
  doHandleItemPeopleChange(val, itemId) {
    const {actions, dayNo, plan} = this.props;
    const {itemSelected, popover} = this.state;
    let sItemId = itemSelected;
    popover[itemSelected] = false;
    const day = plan.days[dayNo - 1];
    for (let i = 0; i < day.items.length; i++) {
      const iNext = day.items[i];
      if (
        !iNext.totalAdults &&
        !iNext.totalKids &&
        day.items[i].itemId !== itemSelected
      ) {
        popover[iNext.itemId] = true;
        sItemId = iNext.itemId;
      }
    }
    this.setState({popover, itemSelected: sItemId});
    if (actions && actions.handleItemPeopleChange) {
      actions.handleItemPeopleChange(val, dayNo, itemId);
    }
  }
  handleAccordion(itemId) {
    const {itemSelected, popover} = this.state;
    if (itemId === itemSelected) {
      popover[itemId] = false;
      this.setState({itemSelected: '', popover});
    } else {
      const day = this.props.plan.days[this.props.dayNo - 1];
      const item = _.find(day.items, (it) => {
        return itemId === it.itemId;
      });
      popover[itemId] = item && !item.totalAdults && !item.totalKids;
      popover[itemSelected] = false;
      this.setState({itemSelected: itemId, popover});
    }
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
      const {itemSelected, popover} = this.state;
      const isExpand = item.itemId === itemSelected;
      const isPopoverOpen = popover[item.itemId];
      const itemActions = {
        handleItemPeopleChange: this.doHandleItemPeopleChange,
        handleClickTraveler: this.handleClickTraveler,
      };
      return (
        <Accordion expanded={isExpand} key={`${dayNo}#${item.name}`}>
          <AccordionSummary
            onClick={() => {
              this.handleAccordion(item.itemId);
            }}
            expandIcon={<ExpandMoreIcon />}
          >
            <div className={classes.heading} ref={isExpand ? this.myRef : null}>
              {item.name}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <ItemGrid
              item={item}
              maxPeople={plan.totalPeople}
              reference={reference}
              actions={itemActions}
              open={isPopoverOpen}
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
