// Components
import _ from 'lodash';
import React, {createElement} from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import {withStyles} from '@material-ui/core/styles';
import CONSTANTS from '../../lib/constants';
import AddBoxIcon from '@material-ui/icons/AddBoxOutlined';
import MinusBoxIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
// Styles
// Variables
const {ATTRACTION, PRODUCT} = CONSTANTS.get().DataModel.TravelPlanItemType;
const styles = (theme) => ({
  root: {
    width: '100%',
  },
  image: {
    width: '-webkit-fill-available',
  },
  hDivFlex: {
    display: 'flex',
    margin: 'auto',
  },
  hDivPeopleDisplay: {
    padding: '4px',
    margin: 'auto',
  },
  hDivPeopleControl: {
    minWidth: '32px',
    padding: '4px',
  },
});

class ItemGrid extends React.Component {
  constructor(props) {
    super(props);
    // Bind event handlers
    this.handleClickTraveler = this.handleClickTraveler.bind(this);
    this.handleCloseTraveler = this.handleCloseTraveler.bind(this);
    this.doHandleAdultChange = this.doHandleAdultChange.bind(this);
    this.doHandleKidChange = this.doHandleKidChange.bind(this);
    // Init data
    // Setup state
    this.state = {
      anchorTraveler: null,
      widthTraveler: null,
    };
  }
  // Event Handlers
  handleClickTraveler(event) {
    this.setState({
      anchorTraveler: event.currentTarget,
      widthTraveler: event.currentTarget.clientWidth,
    });
  }
  handleCloseTraveler() {
    this.setState({anchorTraveler: null, widthTraveler: null});
  }
  doHandleAdultChange(input) {
    // console.log('>>>>ItemGrid.doHandleAdultChange', input);
    const {actions} = this.props;
    if (actions && actions.handleAdultChange) {
      actions.handleAdultChange(input);
    }
  }
  doHandleKidChange(input) {
    // console.log('>>>>ItemGrid.doHandleKidChange', input);
    const {actions} = this.props;
    if (actions && actions.handleKidChange) {
      actions.handleKidChange(input);
    }
  }
  // Display Widget
  render() {
    // console.log('>>>>ItemGrid.render', this.props);
    // Local Variables
    const {classes, item, maxPeople, reference, actions} = this.props;
    const {anchorTraveler, widthTraveler} = this.state;
    const {activities} = reference;
    const {attractions, products} = activities[item.destName];
    // Local Functions
    const getImage = () => {
      return (
        <div>
          <img src={item.imgUrl} className={classes.image} />
        </div>
      );
    };
    const getTraveller = () => {
      const strTraveler =
        !item.totalAdults && !item.totalKids
          ? 'Number of travelers'
          : `Adults: ${item.totalAdults}, Kids: ${item.totalKids}`;
      const getButtons = (width) => {
        const itemExt =
          item.itemType === PRODUCT
            ? _.find(products, (p) => {
              return p.productCode === item.itemId;
            })
            : _.find(attractions, (a) => {
              return a.seoId === item.itemId;
            });
        if (item.pricePlan) {
          return (
            <div style={{width: `${width || 100}px`}}>price plan options</div>
          );
        }
        return (
          <div style={{width: `${width || 100}px`}}>
            <div className={classes.hDivFlex}>
              <div className={classes.hDivPeopleDisplay}>Adult</div>
              <IconButton
                onClick={() => {
                  this.doHandleAdultChange(1);
                }}
                className={classes.hDivPeopleControl}
              >
                <AddBoxIcon color='primary' fontSize='default' />
              </IconButton>
              <div className={classes.hDivPeopleDisplay}>
                {item.totalAdults}
              </div>
              <IconButton
                onClick={() => {
                  this.doHandleAdultChange(-1);
                }}
                className={classes.hDivPeopleControl}
              >
                <MinusBoxIcon color='primary' fontSize='default' />
              </IconButton>
            </div>
            <div className={classes.hDivFlex}>
              <div className={classes.hDivPeopleDisplay}>Kid</div>
              <IconButton
                onClick={() => {
                  this.doHandleKidChange(1);
                }}
                className={classes.hDivPeopleControl}
              >
                <AddBoxIcon color='primary' fontSize='default' />
              </IconButton>
              <div className={classes.hDivPeopleDisplay}>{item.totalKids}</div>
              <IconButton
                onClick={() => {
                  this.doHandleKidChange(-1);
                }}
                className={classes.hDivPeopleControl}
              >
                <MinusBoxIcon color='primary' fontSize='default' />
              </IconButton>
            </div>
          </div>
        );
      };
      return (
        <div>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            onClick={this.handleClickTraveler}
          >
            {strTraveler}
          </Button>
          <Popover
            open={!!anchorTraveler}
            anchorEl={anchorTraveler}
            onClose={this.handleCloseTraveler}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {getButtons(widthTraveler)}
          </Popover>
        </div>
      );
    };
    const getTimeSlot = () => {
      return <div>TimeSlot</div>;
    };
    const getDetails = () => {
      return <div>Details</div>;
    };
    // Display Widget
    return (
      <div className={classes.root}>
        {getImage()}
        {getTraveller()}
        {getTimeSlot()}
        {getDetails()}
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(ItemGrid);
