import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  table: {
    minWidth: 200,
  },
  formControl: {
    margin: theme.spacing.unit,
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
    const {classes} = this.props;
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow style={{height: '32px'}}>
            <TableCell style={{width: '25%', padding: '4px'}}>Total People</TableCell>
            <TableCell style={{width: '25%', padding: '4px'}}>Package Fee</TableCell>
            <TableCell style={{width: '25%', padding: '4px'}}>Discount</TableCell>
            <TableCell style={{width: '25%', padding: '4px'}}>I'm in</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell style={{width: '25%', padding: '4px'}}>5 Adults<br/>3 Kids</TableCell>
            <TableCell style={{width: '25%', padding: '4px'}}>$1500</TableCell>
            <TableCell style={{width: '25%', padding: '4px'}}>2 More People<br/>$200 Off</TableCell>
            <TableCell style={{width: '25%', padding: '4px'}}>
              <FormControl className={classes.formControl}>
                <Select
                  value={this.state.adults}
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
                  value={this.state.kids}
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
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(styles, {withTheme: true})(BotHeader);
