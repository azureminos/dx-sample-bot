// Components
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CONSTANTS from '../../lib/constants';
// Styles
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import SolidCheckIcon from '@material-ui/icons/CheckCircle';
// Variables
const {ATTRACTION, PRODUCT} = CONSTANTS.get().DataModel.TravelPlanItemType;
const styles = (theme) => ({
  flex: {
    display: 'flex',
  },
  imgWrapper: {
    height: 0,
    overflow: 'hidden',
    paddingTop: '100%',
    position: 'relative',
  },
  imgItem: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
  },
  cardIcon: {
    padding: '8px 4px 8px 4px',
  },
  cardTitle: {
    padding: '8px 4px 8px 4px',
    fontSize: '0.7rem',
    height: '50px',
    overflow: 'hidden',
  },
});

class ItemCard extends React.Component {
  constructor() {
    super();
    this.doHandleSelectItem = this.doHandleSelectItem.bind(this);

    this.state = {};
  }
  // Event Handlers
  doHandleSelectItem(input) {
    console.log('>>>>ItemCard.doHandleSelectItem', input);
    const {actions} = this.props;
    if (actions && actions.handleSelectItem) {
      actions.handleSelectItem(input);
    }
  }

  render() {
    // console.log('>>>>ItemCard.render', this.props);
    // Local Variables
    const {classes, item, type, isSelected, dayNo} = this.props;
    const name = item.name;
    const thumbnailURL =
      type === PRODUCT || type === ATTRACTION ? item.thumbnailURL : item.imgUrl;
    // Sub Widget
    // Display Widget
    return (
      <Card>
        <div
          className={classes.imgWrapper}
          onClick={() =>
            this.doHandleSelectItem({item, type, isSelected, dayNo})
          }
        >
          <img src={thumbnailURL} alt={name} className={classes.imgItem} />
        </div>
        <div className={classes.flex}>
          <div
            className={classes.cardIcon}
            onClick={() =>
              this.doHandleSelectItem({item, type, isSelected, dayNo})
            }
          >
            <SolidCheckIcon
              style={{
                display: isSelected ? 'block' : 'none',
                color: blue[500],
              }}
            />
            <CheckIcon
              style={{
                display: isSelected ? 'none' : 'block',
                color: grey[500],
              }}
            />
          </div>
          <div className={classes.cardTitle}>{name}</div>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles, {withTheme: true})(ItemCard);
