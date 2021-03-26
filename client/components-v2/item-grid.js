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
});

class ItemGrid extends React.Component {
  constructor(props) {
    super(props);
    // Bind event handlers
    this.handleClickTraveler = this.handleClickTraveler.bind(this);
    this.handleCloseTraveler = this.handleCloseTraveler.bind(this);
    this.handleAdultChange = this.handleAdultChange.bind(this);
    this.handleKidChange = this.handleKidChange.bind(this);
    this.doHandlePeopleChange = this.doHandlePeopleChange.bind(this);
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
  doHandlePeopleChange() {
    const {totalAdults, totalKids} = this.state;
    const {actions} = this.props;
    if (actions && actions.handlePeopleChange) {
      actions.handlePeopleChange({totalAdults, totalKids});
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
        !totalAdults && !totalKids
          ? 'Number of travelers'
          : `Adults: ${item.totalAdults || 0}, Kids: ${item.totalKids || 0}`;
      const getButtons = (width) => {
        const getOptions = (max) => {
          const options = [];
          for (let i = 0; i <= max; i++) {
            options.push(<option value={i}>{i}}</option>);
          }
          return options;
        };
        if (item.pricePlan) {
          return (
            <div style={{width: `${width || 100}px`}}>price plan options</div>
          );
        }
        return (
          <div style={{display: 'flex', width: `${width || 100}px`}}>
            <div>
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
            <div>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                onClick={this.doHandlePeopleChange}
              >
                Apply
              </Button>
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
