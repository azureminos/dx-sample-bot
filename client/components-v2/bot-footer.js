import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CONSTANTS from '../../lib/constants';

// Variables
const {Instance, Global} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const {maxRoomCapacity, standardRoomCapacity} = Global;

const styles = (theme) => ({
  appBar: {
    position: 'fixed',
    width: '100%',
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    display: 'block',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },
});

class BotFooter extends React.Component {
  constructor(props) {
    console.log('>>>>BotFooter.constructor', props);
    super(props);
    // Set initial state
    this.state = {};
  }
  // ====== Event Handler ======
  // Render footer bar
  render() {
    console.log('>>>>BotFooter.render', this.state);
    // ====== Local Variables ======
    const {classes} = this.props;
    // ====== Web Elements ======
    // ====== Display ======
    return (
      <AppBar position='fixed' color='default' className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div>Here is footer</div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles, {withTheme: true})(BotFooter);
