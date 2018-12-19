import React, {createElement} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import SwipeableViews from 'react-swipeable-views';
import _ from 'lodash';
import BotHeader from './bot-header'

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
});

class FullWidthTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({value});
  };

  handleChangeIndex = index => {
    this.setState({value: index});
  };

  render() {
    const {classes, theme, tabs} = this.props;
    const tabItems = [];
    const tabContents = [];

    _.forEach(tabs, (item, key) => {
      tabItems.push((<Tab label={key} />));
      tabContents.push((<TabContainer dir={theme.direction}>{item}</TabContainer>));
    });

    return (
      <div className={classes.root}>
        <AppBar position='sticky' color='default'>
          <BotHeader/>
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
        <SwipeableViews
          disabled={'true'}
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          {tabContents}
        </SwipeableViews>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(FullWidthTabs);