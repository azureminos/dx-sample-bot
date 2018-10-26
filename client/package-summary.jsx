import React, { Component } from "react";
import {Panel} from 'react-weui';
import Collapsible from 'react-collapsible';

import CenterSlider from './slider.jsx';
import TagList from './tag-list.js';

const PackageSummary = ({packageInst, apiUri, cityAttractions, likeAttraction}) => {
  console.log('>>>>PackageSummary', {packageInst: packageInst, apiUri: apiUri, cityAttractions: cityAttractions});
  const packageImageUrl = apiUri + '/' + packageInst.imageUrl;

  const cityCollapsible = _.keys(cityAttractions).map((city, idx) => {
    let setting = {
      key: idx,
      trigger: city,
      open: true
    };

    let items = cityAttractions[city].map((item) => {
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
          buttonAction={likeAttraction}
          apiUri={apiUri}
        >
        </CenterSlider>
      </Collapsible>
    );
  });

  /*=====Prepare settings of TagList======*/
  let tags = [];
  _.forEach(cityAttractions, function(value, key) {
    console.log(key, value);
    tags = _.concat(tags, _.filter(value, { isLiked: true }));
  });
  console.log('>>>>Show tags', tags);
  tags = tags.map((item) => {return {id: item.id, text: item.name}});
  console.log('>>>>After format tags', tags);

  const tagSetting = {
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
