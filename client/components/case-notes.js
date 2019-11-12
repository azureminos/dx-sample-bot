import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddNotesIcon from '@material-ui/icons/NoteAdd';
import ClearIcon from '@material-ui/icons/Clear';

const styles = (theme) => ({
  root: {},
  buttonGroup: {
    float: 'right',
  },
  button: {
    marginTop: 4,
    marginBottom: 8,
    marginRight: 4,
  },
  rightIcon: {
    paddingLeft: theme.spacing.unit,
  },
  textField: {
    float: 'right',
    margin: 4,
    width: '90%',
  },
});

class CaseNotes extends React.Component {
  constructor(props) {
    console.log('>>>>CaseNotes, constructor()', props);
    super(props);

    this.state = {
      text: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClearNotes = this.handleClearNotes.bind(this);
  }

  handleChange(e) {
    console.log('>>>>CaseNotes, handleChange()', e);
    this.setState({text: e.target.value});
  }

  handleClearNotes(e) {
    console.log('>>>>CaseNotes, handleClearNotes()', e);
    this.setState({text: ''});
  }

  render() {
    console.log('>>>>CaseNotes, render()', this.props);
    const {classes, handleAddNotes} = this.props;

    return (
      <Typography className={classes.root}>
        <form className={classes.container} noValidate autoComplete='off'>
          <div className={classes.buttonGroup}>
            <Button
              variant='contained'
              color='primary'
              onClick={this.handleClearNotes}
              className={classes.button}
            >
              Clear
              <ClearIcon className={classes.rightIcon} />
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => handleAddNotes(this.state.text)}
              className={classes.button}
            >
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
              value={this.state.text}
              onChange={this.handleChange}
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
