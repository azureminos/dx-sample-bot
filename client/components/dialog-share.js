import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const styles = {
  root: {},
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: 16,
    flex: 1,
  },
};
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

class DialogShare extends React.Component {
  constructor(props) {
    super(props);
    this.doHandleClose = this.doHandleClose.bind(this);
    this.doHandleShare = this.doHandleShare.bind(this);
  }
  // Local Variables

  // Event Handlers
  doHandleClose() {
    if (this.props.handleClose) {
      this.props.handleClose();
    }
  }
  doHandleShare() {
    if (this.props.handleShare) {
      this.props.handleShare();
    }
  }
  // Sub Components
  // Display Widget
  render() {
    const {classes, open} = this.props;
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={this.doHandleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={this.doHandleClose}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              Share
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid justify='center' item xs={12}>
            <Button color='primary' onClick={this.doHandleShare}>
              Invite Friends on Messenger
            </Button>
          </Grid>
          <Divider />
          <Grid justify='center' item xs={12}>
            <Button>Invite Friends on Social Media</Button>
          </Grid>
        </Grid>
      </Dialog>
    );
  }
}

export default withStyles(styles)(DialogShare);
