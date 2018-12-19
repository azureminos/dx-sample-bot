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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  table: {
    minWidth: 200,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
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
    // this.handleChange = this.handleChange.bind(this);
  }

  render() {
    const {classes} = this.props;
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell style={{width: '25%', padding: '0px'}}>Total People</TableCell>
            <TableCell style={{width: '25%', padding: '0px'}}>Package Fee</TableCell>
            <TableCell style={{width: '25%', padding: '0px'}}>Discount</TableCell>
            <TableCell style={{width: '25%', padding: '0px'}}>I'm in</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell style={{width: '25%', padding: '0px'}}>5 Adults<br/>3Kids</TableCell>
            <TableCell style={{width: '25%', padding: '0px'}}>$1500</TableCell>
            <TableCell style={{width: '25%', padding: '0px'}}>2 More People<br/>$200 Off</TableCell>
            <TableCell style={{width: '25%', padding: '0px'}}>
              <FormControl className={classes.formControl}>
                <Select
                  value={this.state.adults}
                  // onChange={this.handleChange}
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
                  // onChange={this.handleChange}
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
