import React, {createElement} from 'react';
import _ from 'lodash';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import AttractionCard from './attraction-card.js';
import CardSlider from './card-slider.jsx';
import TagList from './tag-list.js';
import DescPanel from './components/description-panel';

const PackageSummary = ({instPackage, apiUri, cities, cityAttractions, likeAttractions}) => {
  console.log('>>>>PackageSummary props', {cities: cities, inst: instPackage, apiUri: apiUri, cityAttractions: cityAttractions});
  const citySections = _.keys(cityAttractions).map((city) => {
    const tmpCity = _.find(cities, (c) => {return c.name == city;});
    const cityDesc = !!tmpCity ? tmpCity.description : '';
    const cityDescShort = cityDesc.substring(0, (cityDesc.length > 40 ? 40 : cityDesc.length)) + '...';

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
      <div key={cityAttractions[city].id} >
        <Typography variant='h5' style={{padding: 8}} gutterBottom>
          {city}
        </Typography>
        <DescPanel descShort={cityDescShort} descFull={cityDesc} />
        <CardSlider cards={attractionCards} />
        <TagList {...tagSetting} />
        <Divider />
      </div>
    );
  });

  return (
    <section>
      {citySections}
    </section>
  );
};

export default PackageSummary;
