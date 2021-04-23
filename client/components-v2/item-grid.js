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
    width: '100%',
  },
  hDivDescriptionItem: {
    padding: 8,
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
    this.btnPeople = React.createRef();
    // Setup state
    this.state = {
      anchorTraveler: null,
      widthTraveler: null,
      totalAdults: this.props.item.totalAdults || 0,
      totalKids: this.props.item.totalKids || 0,
    };
  }
  componentDidMount() {
    if (this.props.defaultClick) {
      this.btnPeople.current.onClick();
    }
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
    const totalAdults = Number(this.state.totalAdults || 0);
    const totalKids = Number(this.state.totalKids || 0);
    const {item, reference, actions} = this.props;
    let itemExt = this.props.itemExt;
    if (!itemExt) {
      const {attractions, products} = reference.activities[item.destName];
      itemExt =
        item.itemType === PRODUCT
          ? _.find(products, (p) => {
            return p.productCode === item.itemId;
          })
          : _.find(attractions, (a) => {
            return a.seoId === item.itemId;
          });
    }
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
    const inputRef = React.useRef(null);
    const {classes, item, maxPeople, reference, defaultClick} = this.props;
    const {anchorTraveler, widthTraveler, totalAdults, totalKids} = this.state;
    let itemExt = this.props.itemExt;
    if (!itemExt) {
      const {attractions, products} = reference.activities[item.destName];
      itemExt =
        item.itemType === PRODUCT
          ? _.find(products, (p) => {
            return p.productCode === item.itemId;
          })
          : _.find(attractions, (a) => {
            return a.seoId === item.itemId;
          });
    }
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
              ref={this.btnPeople}
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
        <div className={classes.hDivDescriptionItem}>
          <div
            className={classes.hDivDescriptionItem}
          >{`Price: ${itemExt.currencyCode} ${itemExt.price}`}</div>
          <div
            className={classes.hDivDescriptionItem}
          >{`Duration: ${itemExt.duration}`}</div>
          <div className={classes.hDivDescriptionItem}>{`Hotel Pickup: ${
            itemExt.hotelPickup ? 'Offered' : 'Not Offered'
          }`}</div>
          <div className={classes.hDivDescriptionItem}>
            <b>Overview</b>
          </div>
          <div className={classes.hDivDescriptionItem}>
            {itemExt.shortDescription}
          </div>
        </div>
      );
    };
    // Display Widget
    return (
      <div className={classes.root}>
        {getImage()}
        {maxPeople ? getTraveller() : ''}
        {getTimeSlot()}
        {getDetails()}
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(ItemGrid);
