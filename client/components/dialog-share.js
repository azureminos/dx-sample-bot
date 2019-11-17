import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MessageIcon from '@material-ui/icons/MessageRounded';
import Slide from '@material-ui/core/Slide';

import {FacebookShareButton, FacebookIcon} from 'react-share';
import {TwitterShareButton, TwitterIcon} from 'react-share';

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
    // Local Variables
    const {classes, open, apiUri, pushToRemote} = this.props;
    const {instId, title, description, imageUrl} = this.props;
    const shareUrl = `${apiUri}/${instId}`;
    const params = {
      senderId: self.props.viewerId,
      input: {
        instId: instId,
        title: title,
        description: description,
        imageUrl: imageUrl,
      },
    };
    const sharePackage = () => {
      pushToRemote('share:package', params);
      window.MessengerExtensions.requestCloseBrowser(null, null);
    };
    // Display widget
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
        <List component='nav' aria-label='share'>
          <ListItem button onClick={sharePackage}>
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText primary='Invite friends in Messenger' />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary='Share on Social Media' />
          </ListItem>
          <ListItem>
            <FacebookShareButton url={shareUrl} quote={title}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} quote={title}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </ListItem>
        </List>
        <Divider />
      </Dialog>
    );
  }
}

export default withStyles(styles)(DialogShare);
