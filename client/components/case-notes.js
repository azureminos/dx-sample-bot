import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddNotesIcon from '@material-ui/icons/NoteAdd';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
  root: {
  },
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    paddingRight: theme.spacing.unit,
  },
});

class CaseNotes extends React.Component {
  constructor(props) {
    console.log('>>>>CaseNotes, constructor()', props);
    super(props);

    this.state = {
    };

    this.handleAddNotes = this.handleAddNotes.bind(this);
  }

  handleAddNotes(e) {
    console.log('>>>>CaseNotes, handleAddNotes()', e);
  }

  render() {
    console.log('>>>>CaseNotes, render()', this.props);
    const {classes, notes} = this.props;

    return (
      <Typography className={classes.root}>
        <form className={classes.container} noValidate autoComplete='off'>
          <div>
            <Button variant='contained' color='primary' className={classes.button}>
              Clear
              <ClearIcon className={classes.rightIcon} />
            </Button>
            <Button variant='contained' color='primary' className={classes.button}>
              Add
              <AddNotesIcon className={classes.rightIcon} />
            </Button>
          </div>
          <TextField
            id='textarea-notes'
            label='Please leave your notes'
            placeholder='Notes'
            multiline
            rows='4'
            className={classes.textField}
            margin='normal'
          />
        </form>
      </Typography>
    );
  }
}

export default withStyles(styles, {withTheme: true})(CaseNotes);
