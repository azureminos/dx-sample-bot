import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
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
    paddingLeft: theme.spacing.unit,
  },
  textField: {
    float: 'right',
    margin: 4,
    width: '90%',
  },
  notesList: {
    margin: 4,
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
    this.handleAddNotes = this.handleAddNotes.bind(this);
    this.handleClearNotes = this.handleClearNotes.bind(this);
  }

  handleChange(e) {
    console.log('>>>>CaseNotes, handleChange()', e);
    this.setState({text: e.target.value});
  }

  handleAddNotes() {
    const text = this.state.text;
    console.log('>>>>CaseNotes, handleAddNotes()', text);
  }

  handleClearNotes(e) {
    console.log('>>>>CaseNotes, handleClearNotes()', e);
    this.setState({text: ''});
  }

  render() {
    console.log('>>>>CaseNotes, render()', this.props);
    const {classes, notes, users} = this.props;
    const notesList = notes.map((n) => {
      const filteredUser = _.filter(users, {fbId: n.userId});
      const imgProfile = filteredUser.length ? filteredUser[0].profilePic : '';
      const name = filteredUser.length ? filteredUser[0].name : 'Unkown';
      const time = new Date();
      time.setTime(n.timestamp);

      return (
        <ListItem key={n.id}>
          <ListItemAvatar>
            <Avatar
              alt={name}
              src={imgProfile}
            />
          </ListItemAvatar>
          <ListItemText
            primary={n.text}
            secondary={'by ' + name + ' at ' + time.toLocaleString()}
          />
        </ListItem>
      );
    });
    return (
      <Typography className={classes.root}>
        <form className={classes.container} noValidate autoComplete='off'>
          <div className={classes.buttonGroup}>
            <Button variant='contained' color='primary' onClick={this.handleClearNotes} className={classes.button}>
              Clear
              <ClearIcon className={classes.rightIcon} />
            </Button>
            <Button variant='contained' color='primary' onClick={this.handleAddNotes} className={classes.button}>
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
