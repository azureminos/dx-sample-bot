import _ from 'lodash';
import React, {createElement} from 'react';
import Carousel from 'react-multi-carousel';
import ProductCard from '../components-v2/product-card';
import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
// Variables
const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});
const responsive1 = {
  mobile: {
    breakpoint: {max: 464, min: 0},
    items: 2,
  },
};
const responsive2 = {
  mobile: {
    breakpoint: {max: 464, min: 0},
    items: 3,
    paritialVisibilityGutter: 8,
  },
};
class PackageDayPlanner extends React.Component {
  constructor(props) {
    super(props);
    // Bind event handlers
    // Init data
    // Setup state
  }
  // Event Handlers
  // Display Widget
  render() {
    const {
      classes,
      plan,
      planExt,
      reference,
      actions,
      daySelected,
    } = this.props;
    console.log('>>>>PackageDayPlanner, render()', {plan, daySelected});
    // Local Variables
    const day = plan.days[daySelected - 1];
    const {startCity, endCity, items} = day;
    const {products, attractions} = reference.activities[day.endCity];
    const title = `Day ${daySelected}: ${startCity} >> ${endCity}`;
    const productSelected = [];
    const productUnselected = [];
    const {handleSelectProduct} = actions;
    _.each(products, (p) => {
      if (
        !_.find(items, (i) => {
          return i.productCode === p.productCode;
        })
      ) {
        productUnselected.push({...p, isSelected: false});
      } else {
        productSelected.push({...p, isSelected: true});
      }
    });
    // Sub Components
    const getProductCards = (ps) => {
      return _.map(ps, (p) => {
        return (
          <ProductCard
            key={p.productCode}
            product={p}
            daySelected={daySelected}
            actions={handleSelectProduct}
          />
        );
      });
    };
    // Display Widget
    return (
      <div>
        <div>{title}</div>
        <div>Activities Planned</div>
        <Carousel
          deviceType={'mobile'}
          itemClass='image-item'
          responsive={responsive1}
        >
          {getProductCards(productSelected)}
        </Carousel>
        <div>Things To Do</div>
        <Carousel
          deviceType={'mobile'}
          partialVisible
          itemClass='image-item'
          responsive={responsive2}
        >
          {getProductCards(productUnselected)}
        </Carousel>
        <div>Local Attractions</div>
      </div>
    );
  }
}

export default withStyles(styles)(PackageDayPlanner);
