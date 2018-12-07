import React, {createElement} from 'react';
import _ from 'lodash';
import SuperSlider from './super-slider.jsx';
import TagList from './tag-list.js';

const PackageSummary = ({instPackage, apiUri, cityAttractions, likeAttractions}) => {
  console.log('>>>>PackageSummary', {inst: instPackage, apiUri: apiUri, cityAttractions: cityAttractions});
  const packageImageUrl = apiUri + '/' + instPackage.imageUrl;
  //console.log('>>>>packageImageUrl', packageImageUrl);

  const cityCollapsible = _.keys(cityAttractions).map((city) => {
    const setting = {
      trigger: city,
      open: true,
    };

    // Prepare settings of TagList
    let tags = _.filter(cityAttractions[city], {isLiked: true});
    console.log('>>>>Show tags for city['+city+']', tags);
    tags = tags.map((item) => {return {id: item.id, text: item.name};});

    const tagSetting = {
      tags: tags,
      title: null,
      isReadonly: true,
    };

    return (
      <div {...setting} key={cityAttractions[city].id} >
        <div>
          <SuperSlider
            items={cityAttractions[city]}
            buttonName='Like'
            buttonAction={likeAttractions}
            apiUri={apiUri}
          />
          <TagList {...tagSetting} />
        </div>
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
