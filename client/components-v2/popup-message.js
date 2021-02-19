import _ from 'lodash';
import React, {createElement} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withStyles} from '@material-ui/core/styles';

// Variables
const styles = (theme) => ({});

class PopupMessage extends React.Component {
  constructor(props) {
    console.log('>>>>PopupMessage.constructor', props);
    super(props);
    // Bind handler
    // Set initial state
  }
  // ====== Event Handler ======
  // Render web widget
  render() {
    // ====== Local Variables ======
    const {open, handleClose, title, message, buttons} = this.props;
    console.log('>>>>PopupMessage.render', {open, title, message});
    // ====== Local Functions ======
    const getButtons = (btns) => {
      if (btns && btns.length > 0) {
        return _.map(btns, (b) => {
          return (
            <Button key={b.name} onClick={b.click} color='primary'>
              {b.name}
            </Button>
          );
        });
      }
      return (
        <Button onClick={handleClose} color='primary' autoFocus>
          Close
        </Button>
      );
    };
    // ====== Web Elements ======
    // ====== Display ======
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>{getButtons(buttons)}</DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PopupMessage);
