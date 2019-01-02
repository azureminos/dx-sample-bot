import React, {createElement} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
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

    notes.push({id: 1, text: 'Hello', timestamp: Date.now(), userId: '2256669701027152'});
    notes.push({id: 2, text: 'Byebye', timestamp: (Date.now() + 5000), userId: '2256669701027152'});

    const caseNotes = (
      <CaseNotes
        notes={notes}
        users={users}
      />
    );
    
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
        {caseNotes && (
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
            {caseNotes}
          </Drawer>
        )}
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
