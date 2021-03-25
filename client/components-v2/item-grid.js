// Components
import React, {createElement} from 'react';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import {withStyles} from '@material-ui/core/styles';
import CONSTANTS from '../../lib/constants';

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
});

class ItemGrid extends React.Component {
  constructor(props) {
    super(props);
    // Bind event handlers
    this.handleClickTraveler = this.handleClickTraveler.bind(this);
    this.handleCloseTraveler = this.handleCloseTraveler.bind(this);
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
  // Display Widget
  render() {
    // console.log('>>>>ItemGrid.render', this.props);
    // Local Variables
    const {classes, item, maxPeople, reference, actions} = this.props;
    const {anchorTraveler, widthTraveler} = this.state;
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
            <div style={{width: `${widthTraveler || 100}px`}}>
              The content of the Popover.
            </div>
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
