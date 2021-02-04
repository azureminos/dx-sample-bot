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
    this.handleClose = this.handleClose.bind(this);
    // Set initial state
    this.state = {open: props.open};
  }
  // ====== Event Handler ======
  handleClose() {
    this.setState({open: false});
  }
  // Render web widget
  render() {
    console.log('>>>>PopupMessage.render');
    // ====== Local Variables ======
    const {title, message} = this.props;
    // ====== Web Elements ======
    // ====== Display ======
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color='primary' autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PopupMessage);
