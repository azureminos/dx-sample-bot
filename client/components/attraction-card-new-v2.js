// Components
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import AppBar from '@material-ui/core/AppBar';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Divider from '@material-ui/core/Divider';
// Styles
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import SolidCheckIcon from '@material-ui/icons/CheckCircle';
import IconLock from '@material-ui/icons/Lock';
import IconUnlock from '@material-ui/icons/LockOpen';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = (theme) => ({
  flex: {
    display: 'flex',
  },
  bodyContent: {
    marginTop: 80,
  },
  headerBar: {
    position: 'absolute',
    width: '100%',
    height: 60,
    top: 0,
    bottom: 'auto',
  },
  appBar: {
    position: 'absolute',
    width: '100%',
    height: 60,
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },
  descAccordion: {
    display: 'block',
  },
  imgWrapper: {
    height: 0,
    overflow: 'hidden',
    paddingTop: '100%',
    position: 'relative',
  },
  imgItem: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
  },
  cardIcon: {
    padding: '8px 4px 8px 4px',
  },
  cardTitle: {
    padding: '8px 4px 8px 4px',
    fontSize: '0.7rem',
    height: '50px',
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    height: '100%',
    padding: 0,
  },
  label: {
    // Aligns the content of the button vertically.
    flexDirection: 'column',
  },
  headingAccordion: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

class AttractionCard extends React.Component {
  constructor() {
    super();
    this.handleClose = this.handleClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.doHandleAcDescChange = this.doHandleAcDescChange.bind(this);
    this.handleLikeAttraction = this.handleLikeAttraction.bind(this);

    this.state = {
      open: false,
      acDescExpanded: 'pDescription',
    };
  }
  // Event Handlers
  handleClick(e) {
    e.preventDefault();
    this.setState({open: true});
  }
  doHandleAcDescChange(panel) {
    const handleAcDescChange = (e, isExpanded) => {
      this.setState({acDescExpanded: isExpanded ? panel : false});
    };
    return handleAcDescChange;
  }

  handleClose(e) {
    e.preventDefault();
    this.setState({open: false});
  }
  handleLikeAttraction(e, item) {
    e.preventDefault();
    this.setState({open: false});
    if (this.props.likeAttraction) {
      this.props.likeAttraction(item);
    }
  }

  render() {
    const {classes, item} = this.props;
    const {open, acDescExpanded} = this.state;
    console.log('>>>>AttractionCard.render', item);
    // Sub Widget
    const btnLike = !item.isLiked ? (
      <Button
        classes={{root: classes.button, label: classes.label}}
        variant='contained'
        disableRipple
        onClick={(e) => this.handleLikeAttraction(e, item)}
      >
        <IconLock />
        Add to itinerary
      </Button>
    ) : (
      ''
    );
    const btnUnlike = item.isLiked ? (
      <Button
        classes={{root: classes.button, label: classes.label}}
        variant='contained'
        disableRipple
        onClick={(e) => this.handleLikeAttraction(e, item)}
      >
        <IconUnlock />
        Remove from itinerary
      </Button>
    ) : (
      ''
    );
    const btnClose = (
      <Button
        classes={{root: classes.button, label: classes.label}}
        variant='contained'
        disableRipple
        onClick={this.handleClose}
      >
        <CloseIcon />
        Close
      </Button>
    );
    const asDescription = (
      <Accordion
        expanded={acDescExpanded === 'pDescription'}
        onChange={this.doHandleAcDescChange('pDescription')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.headingAccordion}>Overview</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{item.description}</Typography>
        </AccordionDetails>
      </Accordion>
    );
    const asDescIncluded = item.descIncluded ? (
      <Accordion
        expanded={acDescExpanded === 'pDescIncluded'}
        onChange={this.doHandleAcDescChange('pDescIncluded')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.headingAccordion}>
            What's Included
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{item.descIncluded}</Typography>
        </AccordionDetails>
      </Accordion>
    ) : (
      ''
    );
    const asDescAddInfo = item.descAddInfo ? (
      <Accordion
        expanded={acDescExpanded === 'pDescAddInfo'}
        onChange={this.doHandleAcDescChange('pDescAddInfo')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.headingAccordion}>
            Additional Info
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{item.descAddInfo}</Typography>
        </AccordionDetails>
      </Accordion>
    ) : (
      ''
    );
    const asDescSchedule = item.descSchedule ? (
      <Accordion
        expanded={acDescExpanded === 'pDescSchedule'}
        onChange={this.doHandleAcDescChange('pDescSchedule')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.headingAccordion}>
            Departure & Return
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{item.descSchedule}</Typography>
        </AccordionDetails>
      </Accordion>
    ) : (
      ''
    );
    const asDescWhatToExpect = item.descWhatToExpect ? (
      <Accordion
        expanded={acDescExpanded === 'pDescWhatToExpect'}
        onChange={this.doHandleAcDescChange('pDescWhatToExpect')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.headingAccordion}>
            What To Expect
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{item.descWhatToExpect}</Typography>
        </AccordionDetails>
      </Accordion>
    ) : (
      ''
    );
    const asDescCancelPolicy = item.descCancelPolicy ? (
      <Accordion
        expanded={acDescExpanded === 'pDescCancelPolicy'}
        onChange={this.doHandleAcDescChange('pDescCancelPolicy')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.headingAccordion}>
            Cancellation Policy
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{item.descCancelPolicy}</Typography>
        </AccordionDetails>
      </Accordion>
    ) : (
      ''
    );
    const asDescFreqQA = item.descFreqQA ? (
      <Accordion
        expanded={acDescExpanded === 'pDescFreqQA'}
        onChange={this.doHandleAcDescChange('pDescFreqQA')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.headingAccordion}>
            Frequently Asked Questions
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{item.descFreqQA}</Typography>
        </AccordionDetails>
      </Accordion>
    ) : (
      ''
    );
    const modal = (
      <Dialog
        open={open}
        onClose={this.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar color='default' className={classes.headerBar}>
          <Toolbar>
            <div>{item.name}</div>
            <IconButton
              color='inherit'
              onClick={this.handleClose}
              aria-label='Close'
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent classes={{root: classes.bodyContent}}>
          <List>
            <ListItem key={'attraction-images'} dense>
              <GridList cellHeight={160} className={classes.gridList} cols={1}>
                <GridListTile cols={1}>
                  <img src={item.imageUrl} alt={'attraction-image'} />
                </GridListTile>
              </GridList>
            </ListItem>
            <Divider />
            <ListItem key={'attraction-description'} dense>
              <div className={classes.description}>
                {asDescription}
                {asDescIncluded}
                {asDescSchedule}
                {asDescWhatToExpect}
                {asDescAddInfo}
                {asDescCancelPolicy}
                {asDescFreqQA}
              </div>
            </ListItem>
          </List>
        </DialogContent>
        <AppBar position='fixed' color='default' className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            {btnLike}
            {btnUnlike}
            {btnClose}
          </Toolbar>
        </AppBar>
      </Dialog>
    );
    // Display Widget
    return (
      <Card>
        <div className={classes.imgWrapper} onClick={this.handleClick}>
          <img
            src={item.imageUrl}
            alt={item.name}
            className={classes.imgItem}
          />
        </div>
        <div className={classes.flex}>
          <div
            className={classes.cardIcon}
            onClick={(e) => this.handleLikeAttraction(e, item)}
          >
            <SolidCheckIcon
              style={{
                display: item.isLiked ? 'block' : 'none',
                color: blue[500],
              }}
            />
            <CheckIcon
              style={{
                display: item.isLiked ? 'none' : 'block',
                color: grey[500],
              }}
            />
          </div>
          <div onClick={this.handleClick} className={classes.cardTitle}>
            {item.name}
          </div>
        </div>
        {modal}
      </Card>
    );
  }
}

export default withStyles(styles, {withTheme: true})(AttractionCard);
