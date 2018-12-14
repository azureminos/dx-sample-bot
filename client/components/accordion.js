import React, {createElement} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class ControlledAccordion extends React.Component {
  constructor(props) {
    super(props);
    const titles = _.keys(props.mapContents);

    this.state = {
      expanded: titles ? titles[0] : false,
    };
  }

  handleChange = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    console.log('>>>>ControlledAccordion, start render()', {props: this.props, state: this.state});
    const {classes, mapContents} = this.props;
    const {expanded} = this.state;
    const accordions = [];

    _.forEach(_.keys(mapContents), (title) => {
      const panel = (
        <div className={classes.root} key={title}>
          <ExpansionPanel expanded={expanded === title} onChange={this.handleChange(title)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading} variant='h5'>{title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>{mapContents[title]}</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      );
      accordions.push(panel);
    });

    return (
      <div>
        {accordions}
      </div>
    );
  }
}

ControlledAccordion.propTypes = {
  mapContents: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ControlledAccordion);
