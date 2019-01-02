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
  buttonGroup: {
    float: 'right',
  },
  button: {
    marginTop: 4,
    marginBottom: 4,
    marginRight: 4,
  },
  rightIcon: {
    paddingRight: theme.spacing.unit,
  },
  textField: {
    float: 'right',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
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
          <div className={classes.buttonGroup}>
            <Button variant='contained' color='primary' className={classes.button}>
              Clear
              <ClearIcon className={classes.rightIcon} />
            </Button>
            <Button variant='contained' color='primary' className={classes.button}>
              Add
              <AddNotesIcon className={classes.rightIcon} />
            </Button>
          </div>
          <div className={classes.textArea}>
            <TextField
              id='textarea-notes'
              label='Please leave your notes'
              placeholder='Notes'
              multiline
              rows='4'
              className={classes.textField}
              margin='normal'
              variant='outlined'
            />
          </div>
        </form>
      </Typography>
    );
  }
}

export default withStyles(styles, {withTheme: true})(CaseNotes);
