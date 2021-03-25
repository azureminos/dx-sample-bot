// Components
import React, {createElement} from 'react';
import Image from 'rc-image';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {withStyles} from '@material-ui/core/styles';
import CONSTANTS from '../../lib/constants';

// Styles
// Variables
const {ATTRACTION, PRODUCT} = CONSTANTS.get().DataModel.TravelPlanItemType;
const styles = (theme) => ({
  root: {},
});
const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));
const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

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
    };
  }
  // Event Handlers
  handleClickTraveler(event) {
    this.setState({anchorTraveler: event.currentTarget});
  }
  handleCloseTraveler() {
    this.setState({anchorTraveler: null});
  }
  // Display Widget
  render() {
    // console.log('>>>>ItemGrid.render', this.props);
    // Local Variables
    const {classes, item, maxPeople, reference, actions} = this.props;
    const {anchorTraveler} = this.state;
    // Local Functions
    const getImage = () => {
      return <Image src={item.imgUrl} />;
    };
    const getTraveller = () => {
      return (
        <div>
          <Button
            variant='contained'
            color='primary'
            onClick={this.handleClickTraveler}
          >
            Open Menu
          </Button>
          <StyledMenu
            anchorEl={anchorTraveler}
            keepMounted
            open={Boolean(anchorTraveler)}
            onClose={this.handleCloseTraveler}
          >
            <StyledMenuItem>
              <div>Adult</div>
            </StyledMenuItem>
            <StyledMenuItem>
              <div>Kid</div>
            </StyledMenuItem>
          </StyledMenu>
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
      <div>
        {getImage()}
        {getTraveller()}
        {getTimeSlot()}
        {getDetails()}
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(ItemGrid);
