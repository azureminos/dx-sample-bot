import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
// ====== Icons ======
// Variables
const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class PackageSummary extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      classes,
      userId,
      pushToRemote,
      packageSummary,
      itineraries,
      cities,
    } = this.props;
    console.log('>>>>PackageSummary, render()', {
      userId,
      packageSummary,
      itineraries,
      cities,
    });
    // Local Variables
    const labelDays =
      packageSummary.totalDays === 1
        ? `${packageSummary.totalDays} Day`
        : `${packageSummary.totalDays} Days`;
    // Sub Components
    const divDays = _.map(itineraries, (it) => {
      return <div key={it.dayNo}>Day {it.dayNo}</div>;
    });
    // Display Widget
    return (
      <List className={classes.root}>
        <ListItem key={'title'}>
          <Typography variant='h5' component='h3'>
            {packageSummary.name}
          </Typography>
        </ListItem>
        <ListItem key={'description'}>
          <Typography component='p'>{packageSummary.description}</Typography>
        </ListItem>
        <Divider />
        <ListItem key={'Itinerary'}>
          <ListItemAvatar>
            <Avatar>
              <BeachAccessIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='Itinerary Details' secondary={labelDays} />
        </ListItem>
        {divDays}
      </List>
    );
  }
}

export default withStyles(styles)(PackageSummary);
