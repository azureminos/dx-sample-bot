import React, {createElement} from 'react';
import _ from 'lodash';
import withStyles from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import AttractionCard from './attraction-card.js';
import CardSlider from './card-slider.jsx';
import TagList from './tag-list.js';
import DescPanel from './components/description-panel';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: 'lightgrey',
    padding: '4px',
    margin: '4px',
  },
});

class PackageSummary extends React.Component {
  render() {
    console.log('>>>>PackageSummary props', this.props);
    const {classes, apiUri, cities, cityAttractions, likeAttractions} = this.props;
    const citySections = _.keys(cityAttractions).map((city) => {
      const tmpCity = _.find(cities, (c) => {return c.name == city;});
      const cityDesc = !!tmpCity ? tmpCity.description : '';
      const cityDescShort = cityDesc.substring(0, (cityDesc.length > 80 ? 80 : cityDesc.length)) + '...';

      // Prepare settings of TagList
      const tags = _.filter(cityAttractions[city], {isLiked: true});
      console.log('>>>>Show tags for city['+city+']', tags);

      const tagSetting = {
        tags: tags.map((item) => {return {id: item.id, text: item.name};}),
        title: null,
        isReadonly: true,
      };

      // Prepare attraction card list
      const attractionCards = cityAttractions[city].map((a) => {
        return (
          <AttractionCard
            key={a.id}
            item={a}
            apiUri={apiUri}
            handleAttractionClick={likeAttractions}
          />
        );
      });

      return (
        <div key={cityAttractions[city].id} className={classes.root}>
          <Typography variant='h5' gutterBottom>
            {city}
          </Typography>
          <DescPanel descShort={cityDescShort} descFull={cityDesc} />
          <CardSlider cards={attractionCards} />
          <TagList {...tagSetting} />
        </div>
      );
    });

    return (
      <section>
        {citySections}
      </section>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PackageSummary);
