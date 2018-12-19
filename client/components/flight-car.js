import React, { createElement } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FlightLand from "@material-ui/icons/FlightLand";
import FlightTakeoff from "@material-ui/icons/FlightTakeoff";
import DirectionsCar from "@material-ui/icons/DirectionsCar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemIcon from "@material-ui/core/ListItemIcon";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  list: {
    width: '100%',
    minWidth: '330px',
    backgroundColor: theme.palette.background.paper
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

class FlightCar extends React.Component {
  state = {
    departDate: "",
    returnDate: "",
    typeCarRental: "Basic"
  };

  handleCarChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleFlightChange = event => {
    this.setState({ departDate: event.target.value });
  };
  render() {
    const { classes } = this.props;

    return (
      <List className={classes.list}>
        <ListItem>
          <ListItemIcon>
            <FlightTakeoff color='primary'/>
          </ListItemIcon>
          <ListItemText primary="Departure" />
          <ListItemSecondaryAction>
            <FormControl className={classes.formControl}>
              <Select
                value={this.state.departDate}
                onChange={this.handleFlightChange}
                displayEmpty
                inputProps={{
                  name: "departDate",
                  id: "depart-date"
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select Date</em>
                </MenuItem>
                <MenuItem value={10}>03 Feb 2019</MenuItem>
                <MenuItem value={20}>08 Feb 2019</MenuItem>
                <MenuItem value={30}>10 Mar 2019</MenuItem>
                <MenuItem value={40}>03 April 2019</MenuItem>
              </Select>
            </FormControl>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon>
            <FlightLand color='primary'/>
          </ListItemIcon>
          <ListItemText primary="Return" />
          <ListItemSecondaryAction>
            <FormControl className={classes.formControl} disabled>
              <Select value={this.state.departDate} displayEmpty>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>07 Feb 2019</MenuItem>
                <MenuItem value={20}>14 Feb 2019</MenuItem>
                <MenuItem value={30}>16 Mar 2019</MenuItem>
                <MenuItem value={40}>09 April 2019</MenuItem>
              </Select>
            </FormControl>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon>
            <DirectionsCar color='primary'/>
          </ListItemIcon>
          <ListItemText primary="Car Rental" />
          <ListItemSecondaryAction>
            <FormControl className={classes.formControl}>
              <Select
                value={this.state.typeCarRental}
                onChange={this.handleCarChange}
                displayEmpty
                inputProps={{
                  name: "typeCarRental",
                  id: "typeCarRental-simple"
                }}
              >
                <MenuItem value="" disabled>
                  <em>Car Type</em>
                </MenuItem>
                <MenuItem value="Basic">Basic</MenuItem>
                <MenuItem value="Luxury">Luxury</MenuItem>
              </Select>
            </FormControl>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
  }
}

FlightCar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlightCar);
