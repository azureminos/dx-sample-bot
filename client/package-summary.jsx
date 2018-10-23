import React, { Component } from "react";
import {Panel} from 'react-weui';
import Collapsible from 'react-collapsible';

import CenterSlider from './slider.jsx';
import TagList from './tag-list.js';

const PackageSummary = ({packageInst, apiUri, cityAttractions}) => {
  console.log('>>>>PackageSummary', {packageInst: packageInst, apiUri: apiUri, cityAttractions: cityAttractions});
  const packageImageUrl = apiUri + '/' + packageInst.imageUrl;

  let cityMap = _.groupBy(packageInst.items, function(item){return item.city});;
  console.log('>>>>PackageSummary city map', cityMap);

  const cityCollapsible = _.keys(cityMap).map((city, idx) => {
    let setting = {
      key: idx,
      trigger: city,
      open: true
    };

    let items = cityMap[city].map((item) => {
      return {
        id: item.id,
        name: item.attractionName,
        desc: item.desc,
        imageUrl: item.imageUrl
      };
    });

    return (
      <Collapsible {...setting} >
        <CenterSlider
          items={items}
          buttonName="Like"
          apiUri={apiUri}
        >
        </CenterSlider>
      </Collapsible>
    );
  });

  /*=====Prepare settings of TagList======*/
  let tags = [];
  _.forEach(cityAttractions, function(attractions, city) {
    _.concat(tags, _.filter(attractions, { isLiked: true }));
  });

  const TagList = {
    tags: tags,
    title: null,
    isReadonly: true,
  };

  return (
    <div>
      <Panel>
        <h2>{packageInst.name}</h2>
        <img src={packageImageUrl} alt={packageInst.name} width="400" ></img>
        <p>{packageInst.desc}</p>
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
