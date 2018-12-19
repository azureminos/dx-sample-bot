import React, {createElement} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import SwipeableViews from 'react-swipeable-views';
import _ from 'lodash';

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
          <table
            style={{ borderCollapse: "collapse", border: "1px solid black" }}
          >
            <tr style={{ textAlign: "center", border: "1px solid black" }}>
              <th style={{ width: "25%", border: "1px solid black" }}>
                Total People
              </th>
              <th style={{ width: "25%", border: "1px solid black" }}>
                Package Fee
              </th>
              <th style={{ width: "25%", border: "1px solid black" }}>
                Discount
              </th>
              <th style={{ width: "25%", border: "1px solid black" }}>
                I'm in
              </th>
            </tr>
            <tr style={{ textAlign: "center", border: "1px solid black" }}>
              <td style={{ width: "25%", border: "1px solid black" }}>
                5 Adults
                <br />3 Kids
              </td>
              <td style={{ width: "25%", border: "1px solid black" }}>$1500</td>
              <td style={{ width: "25%", border: "1px solid black" }}>
                2 more people
                <br />
                $200 less package fee
              </td>
              <td style={{ width: "25%", border: "1px solid black" }}>
                <div>
                  <button>Add</button>
                  <span>Adult</span>
                  <button>Remove</button>
                </div>
                <div>
                  <button>Add</button>
                  <span>Kid</span>
                  <button>Remove</button>
                </div>
              </td>
            </tr>
          </table>
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
