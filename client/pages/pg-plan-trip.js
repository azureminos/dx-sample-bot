import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PackageSummary from '../components-v2/package-summary';
import BotFooter from '../components-v2/bot-footer';
import Helper from '../../lib/helper';
import PackageHelper from '../../lib/package-helper';
import CONSTANTS from '../../lib/constants';

// Functions
const TabPanel = (props) => {
  const {children, value, index, ...other} = props;
  return value === index ? (
    <Typography
      component='div'
      role='tabpanel'
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <div>{children}</div>
    </Typography>
  ) : (
    ''
  );
};
const a11yProps = (index) => {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
};
// Variables
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  whitespaceTop: {
    height: 50,
  },
  whitespaceBottom: {
    height: 100,
  },
  headerBar: {
    position: 'fixed',
    width: '100%',
    top: 0,
    bottom: 'auto',
  },
  list: {
    padding: 8,
  },
  listItem: {
    padding: '8px 0px 8px 0px',
  },
  itemText: {
    fontSize: '1rem',
    fontWeight: 'bolder',
  },
});
class PagePlanTrip extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doHandleTabSelect = this.doHandleTabSelect.bind(this);
    // Setup state
    this.state = {tabSelected: this.props.daySelected || 0};
  }
  // Event Handlers
  doHandleTabSelect = (event, newValue) => {
    console.log('>>>>PagePlanTrip.doHandleTabSelect', newValue);
    this.setState({tabSelected: newValue});
  };
  // Display Widget
  render() {
    // Local variables
    const {classes, plan, planExt, reference, actions} = this.props;
    const {tabSelected} = this.state;

    const footerActions = {
      handlePeople: null,
      handleRoom: null,
      handleShare: null,
      handlePayment: null,
    };
    // Sub Widgets
    const tabLabels = [
      <Tab key={'Summary'} label={'Summary'} {...a11yProps(0)} />,
    ];
    _.each(plan.days, (it) => {
      const label = `Day ${it.dayNo}`;
      tabLabels.push(
        <Tab key={label} label={label} {...a11yProps(it.dayNo - 1)} />
      );
    });
    const tabPanels = [
      <TabPanel key={'Summary'} value={tabSelected} index={0}>
        <PackageSummary />
      </TabPanel>,
    ];

    _.each(plan.days, (it) => {
      tabPanels.push(
        <TabPanel key={it.dayNo} value={tabSelected} index={it.dayNo}>
          <div>To be added</div>
        </TabPanel>
      );
    });
    return (
      <div className={classes.root}>
        <AppBar position='fixed' color='default' className={classes.headerBar}>
          <Tabs
            value={tabSelected}
            onChange={this.doHandleTabSelect}
            indicatorColor='primary'
            textColor='primary'
            variant='scrollable'
            scrollButtons='auto'
            aria-label='scrollable auto tabs example'
          >
            {tabLabels}
          </Tabs>
        </AppBar>
        <div className={classes.whitespaceTop} />
        {tabPanels}
        <div className={classes.whitespaceBottom} />
        <BotFooter actions={footerActions} />
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PagePlanTrip);
