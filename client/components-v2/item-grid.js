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
    width: '80%',
  },
  hDivDescription: {
    padding: theme.spacing(1),
    width: '100%',
  },
});

class ItemGrid extends React.Component {
  constructor(props) {
    super(props);
    // Bind event handlers
    this.handleClickTraveler = this.handleClickTraveler.bind(this);
    this.handleCloseTraveler = this.handleCloseTraveler.bind(this);
    this.handleAdultChange = this.handleAdultChange.bind(this);
    this.handleKidChange = this.handleKidChange.bind(this);
    this.doHandleItemPeopleChange = this.doHandleItemPeopleChange.bind(this);
    // Init data
    // Setup state
    this.state = {
      anchorTraveler: null,
      widthTraveler: null,
      totalAdults: this.props.item.totalAdults || 0,
      totalKids: this.props.item.totalKids || 0,
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
  handleAdultChange(event) {
    this.setState({totalAdults: event.target.value});
  }
  handleKidChange(event) {
    this.setState({totalKids: event.target.value});
  }
  doHandleItemPeopleChange() {
    const {totalAdults, totalKids} = this.state;
    const {item, reference, actions} = this.props;
    const {attractions, products} = reference.activities[item.destName];
    const itemExt =
      item.itemType === PRODUCT
        ? _.find(products, (p) => {
          return p.productCode === item.itemId;
        })
        : _.find(attractions, (a) => {
          return a.seoId === item.itemId;
        });
    const totalPrice =
      item.itemType === PRODUCT
        ? (itemExt.price || 0) * (totalAdults + totalKids)
        : 0;
    this.setState({anchorTraveler: null, widthTraveler: null});
    if (actions && actions.handleItemPeopleChange) {
      actions.handleItemPeopleChange({totalAdults, totalKids, totalPrice});
    }
  }
  // Display Widget
  render() {
    // console.log('>>>>ItemGrid.render', this.props);
    // Local Variables
    const {classes, item, maxPeople, reference} = this.props;
    const {anchorTraveler, widthTraveler, totalAdults, totalKids} = this.state;
    const {attractions, products} = reference.activities[item.destName];
    const itemExt =
      item.itemType === PRODUCT
        ? _.find(products, (p) => {
          return p.productCode === item.itemId;
        })
        : _.find(attractions, (a) => {
          return a.seoId === item.itemId;
        });
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
          : `Adults: ${item.totalAdults || 0}, Kids: ${item.totalKids || 0}`;
      const getButtons = (width) => {
        const getOptions = (max) => {
          const options = [];
          for (let i = 0; i <= max; i++) {
            options.push(
              <option key={`${item.itemId}#${i}`} value={i}>
                {i}
              </option>
            );
          }
          return options;
        };
        if (item.pricePlan) {
          return (
            <div style={{width: `${width || 100}px`}}>price plan options</div>
          );
        }
        return (
          <div style={{width: `${width || 100}px`}}>
            <div style={{display: 'flex'}}>
              <div className={classes.hDivPeople}>
                <FormControl
                  variant='outlined'
                  className={classes.hDivPeopleControl}
                >
                  <InputLabel htmlFor='adult-selector'>Adult</InputLabel>
                  <Select
                    native
                    value={totalAdults}
                    onChange={this.handleAdultChange}
                    label='Adult'
                    inputProps={{
                      name: 'adult',
                      id: 'adult-selector',
                    }}
                  >
                    {getOptions(maxPeople - totalKids)}
                  </Select>
                </FormControl>
              </div>
              <div className={classes.hDivPeople}>
                <FormControl
                  variant='outlined'
                  className={classes.hDivPeopleControl}
                >
                  <InputLabel htmlFor='kid-selector'>Kid</InputLabel>
                  <Select
                    native
                    value={totalKids}
                    onChange={this.handleKidChange}
                    label='Kid'
                    inputProps={{
                      name: 'kid',
                      id: 'kid-selector',
                    }}
                  >
                    {getOptions(maxPeople - totalAdults)}
                  </Select>
                </FormControl>
              </div>
            </div>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={this.doHandleItemPeopleChange}
            >
              Apply
            </Button>
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
      return '';
    };
    const getDetails = () => {
      return (
        <table className={classes.hDivDescription}>
          <tbody>
            <tr>
              <th>Price:</th>
              <th>{itemExt.price}</th>
            </tr>
            <tr>
              <td>Duration:</td>
              <td>{itemExt.duration}</td>
            </tr>
            <tr>
              <td>Hotel Pickup:</td>
              <td>{itemExt.hotelPickup ? 'Offered' : 'Not Offered'}</td>
            </tr>
            <tr>
              <td>Overview</td>
              <td>{itemExt.shortDescription}</td>
            </tr>
          </tbody>
        </table>
      );
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
