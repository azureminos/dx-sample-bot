import React, {createElement} from 'react';
import _ from 'lodash';
import Divider from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AttractionCard from './attraction-card.js';
import CardSlider from './card-slider.jsx';
import TagList from './tag-list.js';

const PackageSummary = ({instPackage, apiUri, cities, cityAttractions, likeAttractions}) => {
  console.log('>>>>PackageSummary props', {cities: cities, inst: instPackage, apiUri: apiUri, cityAttractions: cityAttractions});
  const allCities = _.groupBy(cities, (c) => {return c.name;});
  console.log('>>>>PackageSummary allCities', allCities);
  const citySections = _.keys(cityAttractions).map((city) => {
    const cityDesc = allCities[city][0].description;
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
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography >{cityDesc.substring(0, (cityDesc.lengh > 40 ? 40 : cityDesc.lengh)) + '...'}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>{cityDesc}</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
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
      {citySections}
    </section>
  );
};

export default PackageSummary;