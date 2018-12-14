import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import yellow from '@material-ui/core/colors/yellow';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
};

class AttractionCard extends React.Component {
  render() {
    const {classes, item, apiUri, handleClick} = this.props;
    const cardContent = !item.description ? '' : (<CardContent><Typography component='p'>{item.description}</Typography></CardContent>);
    return (
      <Card className={classes.card}>
        <CardHeader
          action={
            <IconButton onClick={() => handleClick(item)}>
              <StarIcon style={{display: item.isLiked ? 'block' : 'none', color: yellow[500]}}/>
              <StarBorderIcon style={{display: item.isLiked ? 'none' : 'block', color: yellow[500]}}/>
            </IconButton>
          }
          title={item.name}
        />
        <CardActionArea onClick={() => handleClick(item)}>
          <CardMedia
            className={classes.media}
            image={apiUri + '/' + item.imageUrl}
            title={item.name}
          />
        </CardActionArea>
        {cardContent}
      </Card>
    );
  }
}

export default withStyles(styles)(AttractionCard);
