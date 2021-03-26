// Components
import _ from 'lodash';
import React, {createElement} from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
  hDivPeople: {
    width: '50%',
  },
  hDivPeopleControl: {
    margin: theme.spacing(1),
    minWidth: 80,
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
    console.log('>>>>ItemGrid.doHandleAdultChange', input);
    const {actions} = this.props;
    if (actions && actions.handleAdultChange) {
      actions.handleAdultChange(input);
    }
  }
  doHandleKidChange(input) {
    console.log('>>>>ItemGrid.doHandleKidChange', input);
    const {actions} = this.props;
    if (actions && actions.handleKidChange) {
      actions.handleKidChange(input);
    }
  }
  // Display Widget
  render() {
    // console.log('>>>>ItemGrid.render', this.props);
    // Local Variables
    const {classes, item, maxPeople, reference} = this.props;
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
          <div style={{display: 'flex', width: `${width || 100}px`}}>
            <div className={classes.hDivPeople}>
              <FormControl
                variant='outlined'
                className={classes.hDivPeopleControl}
              >
                <InputLabel htmlFor='adult-selector'>Age</InputLabel>
                <Select
                  native
                  value={item.totalAdults || 0}
                  onChange={this.handleAdultChange}
                  label='Adult'
                  inputProps={{
                    name: 'adult',
                    id: 'adult-selector',
                  }}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </Select>
              </FormControl>
            </div>
            <div className={classes.hDivPeople}>
              <FormControl
                variant='outlined'
                className={classes.hDivPeopleControl}
              >
                <InputLabel htmlFor='kid-selector'>Age</InputLabel>
                <Select
                  native
                  value={item.totalKids || 0}
                  onChange={this.handleKidChange}
                  label='Kid'
                  inputProps={{
                    name: 'kid',
                    id: 'kid-selector',
                  }}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </Select>
              </FormControl>
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
