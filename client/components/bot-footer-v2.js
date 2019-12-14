import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
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
    height: 60,
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },
  table: {
    width: '100%',
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
                <TableCell>{txtTotalPeople}</TableCell>
                <TableCell>
                  <div>
                    <AddBoxOutlinedIcon />
                    <MinusBoxOutlinedIcon />
                  </div>
                </TableCell>
                <TableCell>{finalCost.price}</TableCell>
                <TableCell>
                  <Button variant='contained' disableRipple>
                    <IconShare />
                    Share
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow key={'pay'}>
                <TableCell>{txtTotalRooms}</TableCell>
                <TableCell>
                  <div>
                    <AddBoxOutlinedIcon />
                    <MinusBoxOutlinedIcon />
                  </div>
                </TableCell>
                <TableCell>{finalCost.promo}</TableCell>
                <TableCell>
                  <Button variant='contained' disableRipple>
                    <IconPayment />
                    Deposit
                  </Button>
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
