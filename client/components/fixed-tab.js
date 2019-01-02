import React, {createElement} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import _ from 'lodash';
import BotHeader from './bot-header';
import CaseNotes from './case-notes';

function TabContainer({children, dir}) {
  return (
    <Typography component='div' dir={dir} style={{padding: 8}}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  drawer: {
    width: 300,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 300,
  },
  notesList: {
    margin: 4,
  },
});

class FullWidthTabs extends React.Component {
  state = {
    value: this.props.isOwner ? 0 : 1,
    openNotes: false,
  };

  handleDrawer = () => {
    this.setState({openNotes: !this.state.openNotes});
  }

  handleChange = (event, value) => {
    this.setState({value});
  };

  handleChangeIndex = index => {
    this.setState({value: index});
  };

  render() {
    const {classes, theme, tabs, notes, users} = this.props;
    const tabItems = [];
    const tabContents = [];

    _.forEach(tabs, (item, key) => {
      tabItems.push((<Tab label={key} />));
      tabContents.push((<TabContainer dir={theme.direction}>{item}</TabContainer>));
    });

    const notesList = notes.map((n) => {
      const filteredUser = _.filter(users, {fbId: n.userId});
      const imgProfile = filteredUser.length ? filteredUser[0].profilePic : '';
      const name = filteredUser.length ? filteredUser[0].name : 'Unkown';
      const time = new Date();
      time.setTime(n.timestamp);

      return (
        <ListItem key={n.id}>
          <ListItemAvatar>
            <Avatar
              alt={name}
              src={imgProfile}
            />
          </ListItemAvatar>
          <ListItemText
            primary={n.text}
            secondary={'by ' + name + ' at ' + time.toLocaleString()}
          />
        </ListItem>
      );
    });

    return (
      <div className={classes.root}>
        <AppBar position='sticky' color='default'>
          <div style={{padding: '2px', color: 'red', fontSize: '12px', fontWeight: 'bold', textAlign: 'center'}}>Your package will expire in ....</div>
          <BotHeader drawerHandler={this.handleDrawer} />
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor='primary'
            textColor='primary'
            fullWidth
          >
            {tabItems}
          </Tabs>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant='persistent'
          anchor='left'
          open={this.state.openNotes}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawer}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <CaseNotes />
          <Divider />
          <div className={classes.notesList}>
            <List>
              {notesList}
            </List>
          </div>
        </Drawer>
        {this.state.value === 0 && tabContents[0]}
        {this.state.value === 1 && tabContents[1]}
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(FullWidthTabs);
