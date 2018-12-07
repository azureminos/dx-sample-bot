import React, {createElement} from 'react';
import PropTypes from 'prop-types';
import {AppBar, Tab, Tabs, Typography, withStyles} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import _ from 'lodash';

function TabContainer({children, dir}) {
  return (
    <Typography component='div' dir={dir} style={{padding: 8 * 3}}>
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
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            {tabItems}
          </Tabs>
        </AppBar>
        <SwipeableViews
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
