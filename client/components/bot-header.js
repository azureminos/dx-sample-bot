import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import NotesIcon from '@material-ui/icons/Description';

const styles = theme => ({
  table: {
    minWidth: 200,
  },
  formControl: {
    margin: '4px',
    minWidth: 80,
  },
  selectEmpty: {
    fontSize: 'small',
  },
});

class BotHeader extends React.Component {
  constructor(props) {
    console.log('>>>>BotHeader, constructor()', props);
    super(props);

    this.state = {
      adults: 0,
      kids: 0,
      totalAdults: 7,
      totalKids: 4,
      cost: 1500,
      tier: 15,
      discount: 200,
      maxTotal: 30,
    };

    this.handleAdultdsChange = this.handleAdultdsChange.bind(this);
    this.handleKidsChange = this.handleKidsChange.bind(this);
  }

  handleAdultdsChange(e) {
    console.log('>>>>BotHeader, handleAdultdsChange()', e);
    this.setState({adults: e.target.value});
  }

  handleKidsChange(e) {
    console.log('>>>>BotHeader, handleKidsChange()', e);
    this.setState({kids: e.target.value});
  }

  render() {
    console.log('>>>>BotHeader, render()', this.state);
    const {classes, drawerHandler} = this.props;
    const {adults, kids, totalAdults, totalKids, cost, tier, discount, maxTotal} = this.state;
    let promo1 = '';
    let promo2 = '';
    let finalCost = 0;
    if (tier > totalAdults + adults + totalKids + kids) {
      promo1 = (tier - totalAdults - adults - totalKids - kids)+' more people';
      promo2 = '$'+(cost - discount)+' pp';
      finalCost = cost;
    } else {
      promo1 = 'Max group size is ' + maxTotal;
      finalCost = (cost - discount);
    }

    return (
      <Table className={classes.table}>
        <TableBody>
          <TableRow>
            <TableCell style={{padding: '2px', color: 'red', width: '100%', textAlign: 'center'}}>
              <div>Your package will expire in ....</div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{padding: '4px', width: '20%'}}>{totalAdults + adults} Adults<br/>{totalKids + kids} Kids</TableCell>
            <TableCell style={{padding: '4px', width: '18%'}}>${finalCost} pp</TableCell>
            <TableCell style={{padding: '4px', width: '31%'}}>{promo1}<br/>{promo2}</TableCell>
            <TableCell style={{padding: '4px', width: '23%'}}>
              <FormControl className={classes.formControl}>
                <Select
                  value={adults}
                  onChange={this.handleAdultdsChange}
                  input={<Input name='adults' id='adults-label-placeholder' />}
                  displayEmpty
                  name='adults'
                  className={classes.selectEmpty}
                >
                  <MenuItem value={0}>0 Adult</MenuItem>
                  <MenuItem value={1}>1 Adult</MenuItem>
                  <MenuItem value={2}>2 Adults</MenuItem>
                  <MenuItem value={3}>3 Adults</MenuItem>
                  <MenuItem value={4}>4 Adults</MenuItem>
                  <MenuItem value={5}>5 Adults</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <Select
                  value={kids}
                  onChange={this.handleKidsChange}
                  input={<Input name='kids' id='kids-label-placeholder' />}
                  displayEmpty
                  name='kids'
                  className={classes.selectEmpty}
                >
                  <MenuItem value={0}>0 Kid</MenuItem>
                  <MenuItem value={1}>1 Kid</MenuItem>
                  <MenuItem value={2}>2 kids</MenuItem>
                  <MenuItem value={3}>3 kids</MenuItem>
                  <MenuItem value={4}>4 kids</MenuItem>
                  <MenuItem value={5}>5 kids</MenuItem>
                </Select>
              </FormControl>
            </TableCell>
            <TableCell style={{padding: '0px', width: '8%'}}>
              <IconButton
                color='inherit'
                aria-label='Open Notes'
                onClick={drawerHandler}
              >
                <NotesIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles, {withTheme: true})(BotHeader);
