// Components
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CONSTANTS from '../../lib/constants';
// Styles
// Variables
const {Global} = CONSTANTS.get();
const styles = (theme) => ({
  root: {
    maxWidth: 345,
    margin: '8px auto',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
});

class PlanCard extends React.Component {
  constructor() {
    super();
    this.doHandleClickCard = this.doHandleClickCard.bind(this);
    this.state = {};
  }
  // Event Handlers
  doHandleClickCard(input) {
    console.log('>>>>PlanCard.doHandleClickCard', input);
    if (this.props && this.props.handleClickCard) {
      this.props.handleClickCard(input);
    }
  }

  render() {
    // console.log('>>>>PlanCard.render', this.props);
    // Local Variables
    const {classes, plan} = this.props;
    const thumbnailURL = Global.defaultImgUrl;
    const dtStart = plan.startDate.format('DD/MM/YYYY');
    const dtEnd = plan.endDate.format('DD/MM/YYYY');
    const dtUpdated = plan.updatedAt.format('DD/MM/YYYY');
    // Sub Widget
    // Display Widget
    return (
      <Card
        className={classes.root}
        raised
        onClick={() => {
          this.doHandleClickCard(plan._id);
        }}
      >
        <CardHeader
          title={`${dtStart} - ${dtEnd}, ${plan.startCity.name}`}
          subheader={`Last Updated: ${dtUpdated}`}
        />
        <CardMedia className={classes.media} image={thumbnailURL} />
        <CardContent>
          <Typography variant='body2' color='textSecondary' component='p'>
            {`${dtStart} - ${dtEnd}, ${plan.startCity.name}`}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            {`TotalPeople: ${plan.totalPeople}`}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PlanCard);
