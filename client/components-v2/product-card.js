// Components
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
// Styles
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import SolidCheckIcon from '@material-ui/icons/CheckCircle';

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

class ProductCard extends React.Component {
  constructor() {
    super();
    this.doHandleSelectProduct = this.doHandleSelectProduct.bind(this);

    this.state = {};
  }
  // Event Handlers
  doHandleSelectProduct(e, input) {
    e.preventDefault();
    const {actions} = this.props;
    if (actions && actions.handleSelectProduct) {
      actions.handleSelectProduct(input);
    }
  }

  render() {
    const {classes, product, daySelected} = this.props;
    console.log('>>>>ProductCard.render', product);
    // Sub Widget
    // Display Widget
    return (
      <Card>
        <div
          className={classes.imgWrapper}
          onClick={(e) => this.doHandleSelectProduct(e, {product, daySelected})}
        >
          <img
            src={product.thumbnailURL}
            alt={product.name}
            className={classes.imgItem}
          />
        </div>
        <div className={classes.flex}>
          <div
            className={classes.cardIcon}
            onClick={(e) =>
              this.doHandleSelectProduct(e, {product, daySelected})
            }
          >
            <SolidCheckIcon
              style={{
                display: product.isSelected ? 'block' : 'none',
                color: blue[500],
              }}
            />
            <CheckIcon
              style={{
                display: product.isSelected ? 'none' : 'block',
                color: grey[500],
              }}
            />
          </div>
          <div className={classes.cardTitle}>{product.name}</div>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles, {withTheme: true})(ProductCard);
