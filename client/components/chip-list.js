import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import _ from 'lodash';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit,
  },
});

class ChipList extends React.Component {
  render() {
    console.log('>>>>ChipList, render()', this.props);
    const {tags, classes} = this.props;
    const chips = tags.map((t) => {
      return (
        <Chip
          key={t.id}
          avatar={<Avatar alt={t.name} src={t.imageUrl} />}
          label={t.name}
          className={classes.chip}
        />
      );
    });

    return (
      <div className={classes.root}>
        {chips}
      </div>
    );
  }
}

export default withStyles(styles)(ChipList);
