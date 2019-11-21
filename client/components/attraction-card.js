import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import SolidCheckIcon from '@material-ui/icons/CheckCircle';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  headerRoot: {
    padding: 8,
    height: 80,
  },
  headerContent: {
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: '1rem',
  },
  bodyRoot: {
    padding: '8px',
    overflow: 'hidden',
    maxHheight: '100px',
  },
};

class AttractionCard extends React.Component {
  render() {
    const {classes, item, doLikeAttraction} = this.props;
    const cardContent = !item.description ? (
      ''
    ) : (
      <CardContent className={{root: styles.bodyRoot}}>
        <Typography component='p' className={classes.bodyContent}>
          {item.description}
        </Typography>
      </CardContent>
    );
    return (
      <Card className={classes.card}>
        <CardHeader
          classes={{
            root: classes.headerRoot,
            title: classes.headerTitle,
            content: classes.headerContent,
          }}
          action={
            <IconButton onClick={() => doLikeAttraction(item)}>
              <SolidCheckIcon
                style={{
                  display: item.isLiked ? 'block' : 'none',
                  color: blue[500],
                }}
              />
              <CheckIcon
                style={{
                  display: item.isLiked ? 'none' : 'block',
                  color: grey[500],
                }}
              />
            </IconButton>
          }
          title={item.name}
        />
        <CardActionArea onClick={() => doLikeAttraction(item)}>
          <CardMedia
            className={classes.media}
            image={item.imageUrl}
            title={item.name}
          />
        </CardActionArea>
        {cardContent}
      </Card>
    );
  }
}

export default withStyles(styles)(AttractionCard);
