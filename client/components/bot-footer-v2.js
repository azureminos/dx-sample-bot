import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/Button';
import CONSTANTS from '../../lib/constants';
import IconShare from '@material-ui/icons/ShareOutlined';
import IconPayment from '@material-ui/icons/PaymentOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import MinusBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';

// Variables
const {Instance, Global} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const {maxRoomCapacity, standardRoomCapacity} = Global;

const styles = (theme) => ({
  appBar: {
    position: 'absolute',
    width: '100%',
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },
  table: {},
  displayFlex: {
    display: 'flex',
  },
  colItem: {
    width: '20%',
    padding: '4px 0px 4px 8px',
    fontSize: 16,
  },
  colController: {
    width: '10%',
    padding: 0,
  },
  colDescription: {
    padding: '4px 0px 4px 8px',
    fontSize: 16,
  },
  colButton: {
    width: '10%',
    padding: 0,
  },
  iconButtonRoot: {
    minWidth: 30,
  },
  iconButtonText: {
    margin: 2,
    padding: 0,
  },
  iconSmall: {
    fontSize: 24,
  },
});

class BotFooter extends React.Component {
  constructor(props) {
    console.log('>>>>BotFooter.constructor', props);
    super(props);
    this.doAddPeople = this.doAddPeople.bind(this);
    this.doRemovePeople = this.doRemovePeople.bind(this);
    this.doAddRoom = this.doAddRoom.bind(this);
    this.doRemoveRoom = this.doRemoveRoom.bind(this);
    // Set initial state
    this.state = {};
  }
  // ====== Event Handler ======
  // Handle add people
  doAddPeople(e) {
    console.log('>>>>BotFooter.doAddPeople', e);
    const {instPackageExt, actions, rates} = this.props;
    const {people} = instPackageExt;
    if (actions && actions.handlePeople) {
      const newPeople = people + 1;
      const newRooms = Math.ceil(newPeople / standardRoomCapacity);
      actions.handlePeople({people: newPeople, rooms: newRooms, rates});
    }
  }
  // Handle remove people
  doRemovePeople(e) {
    console.log('>>>>BotFooter.doRemovePeople', e);
    const {instPackageExt, actions, rates} = this.props;
    const {people} = instPackageExt;
    if (actions && actions.handlePeople) {
      const newPeople = people - 1;
      const newRooms = Math.ceil(newPeople / standardRoomCapacity);
      actions.handlePeople({people: newPeople, rooms: newRooms, rates});
    }
  }
  // Handle add room
  doAddRoom(e) {
    console.log('>>>>BotFooter.doAddRoom', e);
    const {instPackageExt, actions, rates} = this.props;
    const {rooms} = instPackageExt;
    if (actions && actions.handleRoom) {
      actions.handleRoom({rooms: rooms + 1, rates});
    }
  }
  // Handle remove room
  doRemoveRoom(e) {
    console.log('>>>>BotFooter.doRemoveRoom', e);
    const {instPackageExt, actions, rates} = this.props;
    const {rooms} = instPackageExt;
    if (actions && actions.handleRoom) {
      actions.handleRoom({rooms: rooms - 1, rates});
    }
  }
  // Render footer bar
  render() {
    console.log('>>>>BotFooter.render', this.state);
    // ====== Local Variables ======
    const {classes, instPackage, instPackageExt} = this.props;
    const {curGap, curRate, nxtGap, nxtRate, max} = instPackageExt;
    const {people, otherPeople, rooms, otherRooms} = instPackageExt;
    const totalPeople = people + otherPeople;
    const totalRooms = rooms + otherRooms;
    const txtTotalPeople =
      totalPeople > 1 ? `${totalPeople} People` : '1 Person';
    const txtTotalRooms = totalRooms > 1 ? `${totalRooms} Rooms` : '1 Room';
    const finalCost = {price: 0, promo: ''};
    const isRoomDisabled = !instPackage.isCustomised;
    if (curGap === 0) {
      finalCost.price = `${curRate} pp`;
      finalCost.promo =
        nxtGap > 0
          ? `${nxtGap} more people ${nxtRate} pp`
          : `Max group size is ${max}`;
    } else {
      finalCost.price = `${curGap} more people $${curRate} pp`;
      finalCost.promo =
        nxtGap > 0
          ? `${nxtGap} more people ${nxtRate} pp`
          : `Max group size is ${max}`;
    }
    // ====== Web Elements ======
    // ====== Display ======
    return (
      <AppBar position='fixed' color='default' className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Table className={classes.table}>
            <TableBody>
              <TableRow key={'share'}>
                <TableCell classes={{body: classes.colItem}}>
                  {txtTotalPeople}
                </TableCell>
                <TableCell classes={{body: classes.colController}}>
                  <div className={classes.displayFlex}>
                    <IconButton
                      classes={{
                        root: classes.iconButtonRoot,
                        text: classes.iconButtonText,
                      }}
                      aria-label='Add'
                    >
                      <AddBoxOutlinedIcon className={classes.iconSmall} />
                    </IconButton>
                    <IconButton
                      classes={{
                        root: classes.iconButtonRoot,
                        text: classes.iconButtonText,
                      }}
                      aria-label='Remove'
                    >
                      <MinusBoxOutlinedIcon className={classes.iconSmall} />
                    </IconButton>
                  </div>
                </TableCell>
                <TableCell classes={{body: classes.colDescription}}>
                  {finalCost.price}
                </TableCell>
                <TableCell classes={{body: classes.colButton}}>
                  <IconButton
                    classes={{
                      root: classes.iconButtonRoot,
                      text: classes.iconButtonText,
                    }}
                    aria-label='Share'
                  >
                    <IconShare />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow key={'pay'}>
                <TableCell classes={{body: classes.colItem}}>
                  {txtTotalRooms}
                </TableCell>
                <TableCell classes={{body: classes.colController}}>
                  <div className={classes.displayFlex}>
                    <IconButton
                      classes={{
                        root: classes.iconButtonRoot,
                        text: classes.iconButtonText,
                      }}
                      aria-label='Add'
                      disabled={isRoomDisabled}
                    >
                      <AddBoxOutlinedIcon className={classes.iconSmall} />
                    </IconButton>
                    <IconButton
                      classes={{
                        root: classes.iconButtonRoot,
                        text: classes.iconButtonText,
                      }}
                      aria-label='Remove'
                      disabled={isRoomDisabled}
                    >
                      <MinusBoxOutlinedIcon className={classes.iconSmall} />
                    </IconButton>
                  </div>
                </TableCell>
                <TableCell classes={{body: classes.colDescription}}>
                  {finalCost.promo}
                </TableCell>
                <TableCell classes={{body: classes.colButton}}>
                  <IconButton
                    classes={{
                      root: classes.iconButtonRoot,
                      text: classes.iconButtonText,
                    }}
                    aria-label='Deposit'
                  >
                    <IconPayment />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles, {withTheme: true})(BotFooter);