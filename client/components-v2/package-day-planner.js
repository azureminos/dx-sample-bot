import _ from 'lodash';
import React, {createElement} from 'react';
import Carousel from 'react-multi-carousel';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ItemCard from '../components-v2/item-card';
import {withStyles} from '@material-ui/core/styles';
import CONSTANTS from '../../lib/constants';
// ====== Icons ======
// Variables
const {TravelPlanItemType} = CONSTANTS.get().DataModel;
const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  divTitleRoot: {
    display: 'flex',
    alignItems: 'center',
  },
  divTitleItem: {
    margin: 4,
  },
  fBtnRoot: {
    margin: 4,
  },
});
const responsive1 = {
  mobile: {
    breakpoint: {max: 464, min: 0},
    items: 3,
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
    this.doHandleSelectCity = this.doHandleSelectCity.bind(this);
    // Init data
    // Setup state
    this.state = {
      selectedCity: '',
    };
  }
  // Event Handlers
  doHandleSelectCity(city) {
    // console.log('>>>>PackageDayPlanner.doHandleSelectCity');
    this.setState({selectedCity: city});
  }
  // Display Widget
  render() {
    const {classes, plan, planExt} = this.props;
    const {reference, actions, dayNo} = this.props;
    console.log('>>>>PackageDayPlanner, render()', {plan, dayNo});
    // Local Variables
    const day = plan.days[dayNo - 1];
    const {cities, items} = day;
    const isLastDay = dayNo === plan.days.length;
    const selectedCity =
      this.state.selectedCity ||
      (isLastDay ? cities[0].name : cities[cities.length - 1].name);
    if (!reference.activities[selectedCity]) {
      return <div>Loading</div>;
    }
    const {products, attractions} = reference.activities[selectedCity];
    const {handleSelectItem} = actions;
    const title = `Day ${dayNo}:`;
    const itemSelected = [];
    // Unselected products of the selected city
    const productUnselected = _.filter(products, (p) => {
      const pMatcher = _.find(items, (it) => {
        return it.itemId === p.productCode;
      });
      return !pMatcher;
    });
    // Unselected attractions of the selected city
    const attractionUnselected = _.filter(attractions, (a) => {
      const aMatcher = _.find(items, (it) => {
        return it.itemId === a.seoId;
      });
      return !aMatcher;
    });
    // Enhanced items
    for (let m = 0; m < items.length; m++) {
      const i = items[m];
      const {products, attractions} = reference.activities[i.destName];
      const pMatcher = _.find(products, (p) => {
        return i.itemId === p.productCode;
      });
      if (pMatcher) {
        itemSelected.push({...i, product: pMatcher});
        continue;
      }
      const aMatcher = _.find(attractions, (a) => {
        return i.itemId === a.seoId;
      });
      if (aMatcher) {
        itemSelected.push({...i, attraction: aMatcher});
        continue;
      }
    }
    // Local Functions
    const getItemKey = (item, type) => {
      if (type === TravelPlanItemType.PRODUCT) {
        return item.productCode;
      } else if (type === TravelPlanItemType.ATTRACTION) {
        return item.seoId;
      }
      return item.itemId;
    };
    const getItemCards = (items, isSelected, type) => {
      return _.map(items, (item) => {
        return (
          <ItemCard
            key={getItemKey(item, type)}
            item={item}
            type={type}
            isSelected={isSelected}
            dayNo={dayNo}
            actions={{handleSelectItem}}
          />
        );
      });
    };
    const getBtnCity = (cts) => {
      return _.map(cts, (c) => {
        const isSelected = selectedCity === c.name;
        return (
          <Button
            key={`${dayNo}##${c.name}`}
            color={isSelected ? 'primary' : 'default'}
            size='small'
            variant='contained'
            classes={{root: classes.fBtnRoot}}
            onClick={() => {
              this.doHandleSelectCity(c.name);
            }}
          >
            {c.name}
          </Button>
        );
      });
    };
    // Display Widget
    return (
      <div>
        <div className={classes.divTitleRoot}>
          <div className={classes.divTitleItem}>{title}</div>
          {getBtnCity(cities)}
        </div>
        <Divider />
        <div className={classes.divTitleItem}>Activities Planned</div>
        <Carousel
          deviceType={'mobile'}
          itemClass='image-item'
          responsive={responsive1}
        >
          {getItemCards(itemSelected, true)}
        </Carousel>
        <div className={classes.divTitleItem}>Things To Do</div>
        <Carousel
          deviceType={'mobile'}
          partialVisible
          itemClass='image-item'
          responsive={responsive2}
        >
          {getItemCards(productUnselected, false, TravelPlanItemType.PRODUCT)}
        </Carousel>
        <div className={classes.divTitleItem}>Local Attractions</div>
        <Carousel
          deviceType={'mobile'}
          partialVisible
          itemClass='image-item'
          responsive={responsive2}
        >
          {getItemCards(
            attractionUnselected,
            false,
            TravelPlanItemType.ATTRACTION
          )}
        </Carousel>
      </div>
    );
  }
}

export default withStyles(styles)(PackageDayPlanner);
