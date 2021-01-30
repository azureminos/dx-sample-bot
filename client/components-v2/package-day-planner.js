import _ from 'lodash';
import React, {createElement} from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Carousel from 'react-multi-carousel';
import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
// Variables
const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

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
    const {startCity, endCity} = day;
    const {products, attractions} = reference.activities[day.endCity];
    const title = `Trip Plan Day ${daySelected}: ${startCity} >> ${endCity}`;
    // Sub Components
    const getProductsSwiper = (ps) => {
      return _.map(ps, (p) => {
        return (
          <GridList
            key={`${daySelected}_${p.productCode}`}
            cellHeight={160}
            cols={1}
          >
            <GridListTile cols={1}>
              <img src={p.thumbnailURL} alt={'product-image'} />
            </GridListTile>
          </GridList>
        );
      });
    };
    // Display Widget
    return (
      <div>
        <div>{title}</div>
        <Carousel partialVisbile itemClass='image-item'>
          {getProductsSwiper(products)}
        </Carousel>
      </div>
    );
  }
}

export default withStyles(styles)(PackageDayPlanner);
