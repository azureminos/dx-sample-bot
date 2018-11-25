import React, {createElement} from 'react';
import {Panel} from 'react-weui';
import Collapsible from 'react-collapsible';
import _ from 'lodash';
import SuperSlider from './super-slider.jsx';
import TagList from './tag-list.js';

const PackageSummary = ({instPackage, apiUri, cityAttractions, likeAttraction}) => {
  console.log('>>>>PackageSummary', {instPackage: instPackage, apiUri: apiUri, cityAttractions: cityAttractions});
  const packageImageUrl = apiUri + '/' + instPackage.imageUrl;
  console.log('>>>>packageImageUrl', packageImageUrl);

  const cityCollapsible = _.keys(cityAttractions).map((city) => {
    const setting = {
      trigger: city,
      open: true,
    };

    return (
      <Collapsible {...setting} key={cityAttractions[city].id} >
        <SuperSlider
          items={cityAttractions[city]}
          buttonName='Like'
          buttonAction={likeAttraction}
          apiUri={apiUri}
        />
      </Collapsible>
    );
  });

  /*=====Prepare settings of TagList======*/
  let tags = [];
  _.forEach(cityAttractions, function(value, key) {
    console.log(key, value);
    tags = _.concat(tags, _.filter(value, {isLiked: true}));
  });
  console.log('>>>>Show tags', tags);
  tags = tags.map((item) => {return {id: item.id, text: item.name};});
  console.log('>>>>After format tags', tags);

  const tagSetting = {
    tags: tags,
    title: null,
    isReadonly: true,
  };

  return (
    <div>
      <Panel>
        <h2>{instPackage.name}</h2>
        <img src={packageImageUrl} alt={instPackage.name} width='400' ></img>
        <p>{instPackage.description}</p>
      </Panel>
      <Panel>
        {cityCollapsible}
      </Panel>
      <Panel>
        <TagList {...tagSetting} />
      </Panel>
    </div>
  );
};

export default PackageSummary;
