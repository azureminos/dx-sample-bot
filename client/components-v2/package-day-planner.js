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
const {PRODUCT, ATTRACTION} = TravelPlanItemType;
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
    const {
      handleSelectItem,
      handlePopupItemDetails,
      handleViewItemDetails,
    } = actions;
    console.log('>>>>PackageDayPlanner, render()', {plan, dayNo});
    // Local Variables
    const day = plan.days[dayNo - 1];
    const {cities, items} = day;
    const isLastDay = dayNo === plan.days.length;
    const isUserSelected = !!this.state.selectedCity;
    let selectedCity =
      this.state.selectedCity ||
      (isLastDay ? cities[0].name : cities[cities.length - 1].name);
    if (!isUserSelected && !reference.activities[selectedCity]) {
      for (let i = 0; i < cities.length; i++) {
        if (reference.activities[cities[i].name]) {
          selectedCity = cities[i].name;
          break;
        }
      }
    }
    const title = `Day ${dayNo}:`;
    const itemSelected = [];
    let productUnselected = [];
    let attractionUnselected = [];
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
    if (reference.activities[selectedCity]) {
      const {products, attractions} = reference.activities[selectedCity];
      // Unselected products of the selected city
      productUnselected = _.filter(products, (p) => {
        const pMatcher = _.find(items, (it) => {
          return it.itemId === p.productCode;
        });
        return !pMatcher;
      });
      // Unselected attractions of the selected city
      attractionUnselected = _.filter(attractions, (a) => {
        const aMatcher = _.find(items, (it) => {
          return it.itemId === a.seoId;
        });
        return !aMatcher;
      });
    }
    // Local Functions
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
    const getItemCards = (items, isSelected, type) => {
      const getItemKey = (item, type) => {
        if (type === PRODUCT) {
          return item.productCode;
        } else if (type === ATTRACTION) {
          return item.seoId;
        }
        return item.itemId;
      };
      return _.map(items, (item) => {
        const cardActions = {
          handleSelectItem: handleSelectItem,
          handleItemDetails: type
            ? handlePopupItemDetails
            : handleViewItemDetails,
        };
        return (
          <ItemCard
            key={getItemKey(item, type)}
            item={item}
            type={type}
            isSelected={isSelected}
            dayNo={dayNo}
            actions={cardActions}
          />
        );
      });
    };
    const getSelectedItems = (items) => {
      return (
        <div>
          <div className={classes.divTitleItem}>Activities Planned</div>
          <Carousel
            deviceType={'mobile'}
            itemClass='image-item'
            responsive={responsive1}
          >
            {getItemCards(items, true)}
          </Carousel>
        </div>
      );
    };
    const getUnselectedProducts = (items) => {
      return (
        <div>
          <div className={classes.divTitleItem}>Things To Do</div>
          <Carousel
            deviceType={'mobile'}
            partialVisible
            itemClass='image-item'
            responsive={responsive2}
          >
            {getItemCards(items, false, PRODUCT)}
          </Carousel>
        </div>
      );
    };
    const getUnselectedAttractions = (items) => {
      return (
        <div>
          <div className={classes.divTitleItem}>Local Attractions</div>
          <Carousel
            deviceType={'mobile'}
            partialVisible
            itemClass='image-item'
            responsive={responsive2}
          >
            {getItemCards(items, false, ATTRACTION)}
          </Carousel>
        </div>
      );
    };
    // Display Widget
    return (
      <div>
        <div className={classes.divTitleRoot}>
          <div className={classes.divTitleItem}>{title}</div>
          {getBtnCity(cities)}
        </div>
        <Divider />
        {itemSelected.length > 0 ||
        productUnselected.length > 0 ||
        attractionUnselected.length > 0
          ? getSelectedItems(itemSelected)
          : ''}
        {productUnselected.length > 0
          ? getUnselectedProducts(productUnselected)
          : ''}
        {attractionUnselected.length > 0
          ? getUnselectedAttractions(attractionUnselected)
          : ''}
        {itemSelected.length === 0 &&
        productUnselected.length === 0 &&
        attractionUnselected.length === 0
          ? 'a static page'
          : ''}
      </div>
    );
  }
}

export default withStyles(styles)(PackageDayPlanner);
