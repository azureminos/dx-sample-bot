import React, {createElement} from 'react';
import _ from 'lodash';
import {Divider, Typography} from '@material-ui/core';
import AttractionCard from './attraction-card.js';
import CardSlider from './card-slider.jsx';
import TagList from './tag-list.js';

const PackageSummary = ({instPackage, apiUri, cityAttractions, likeAttractions}) => {
  console.log('>>>>PackageSummary', {inst: instPackage, apiUri: apiUri, cityAttractions: cityAttractions});

  const cityCollapsible = _.keys(cityAttractions).map((city) => {
    // Prepare settings of TagList
    let tags = _.filter(cityAttractions[city], {isLiked: true});
    console.log('>>>>Show tags for city['+city+']', tags);
    tags = tags.map((item) => {return {id: item.id, text: item.name};});

    const tagSetting = {
      tags: tags,
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
        <CardSlider
          cards={attractionCards}
        />
        <TagList {...tagSetting} />
        <Divider />
      </div>
    );
  });

  return (
    <section>
      {cityCollapsible}
    </section>
  );
};

export default PackageSummary;
