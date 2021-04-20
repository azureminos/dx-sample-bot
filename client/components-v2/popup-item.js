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

class PopupItem extends React.Component {
  constructor(props) {
    console.log('>>>>PopupItem.constructor', props);
    super(props);
    // Bind handler
    // Set initial state
  }
  // ====== Event Handler ======
  // Render web widget
  render() {
    console.log('>>>>PopupItem.render', this.props);
    // ====== Local Variables ======
    const {dayNo, item, destinations, message} = this.props;
    const {handleClose, handleSelectItem} = this.props;
    // ====== Local Functions ======
    // ====== Web Elements ======
    // ====== Display ======
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Hello Title</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {message || 'Hello Message'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            onClick={() => {
              handleSelectItem();
            }}
            color='primary'
            autoFocus
          >
            Add to my plan
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PopupItem);
