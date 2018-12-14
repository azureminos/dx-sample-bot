import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import IconButton from '@material-ui/core/IconButton';
import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';

const styles = theme => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class HotelCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (item) => {
    console.log('>>>>HotelCard, handleChange()', item);
    this.setState({isSelected: !this.state.isSelected});
  };

  render() {
    console.log('>>>>HotelCard render()', this.props);
    const {classes, item, apiUri, handleClick} = this.props;
    return (
      <Card className={classes.card}>
        <CardHeader
          className={classes.heading}
          action={
            <IconButton onClick={(event) => this.handleChange(item)}>
              <CheckIcon style={{color: (this.state.isSelected) ? green[500] : grey[500]}}/>
            </IconButton>
          }
          title={item.name}
        />
        <CardActionArea onClick={(event) => this.handleChange(item)}>
          <CardMedia
            className={classes.media}
            image={apiUri + '/' + item.imageUrl}
            title={item.name}
          />
        </CardActionArea>
      </Card>
    );
  }
}

export default withStyles(styles)(HotelCard);
