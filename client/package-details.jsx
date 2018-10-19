import React, { Component } from "react";
import {Panel} from 'react-weui';
import Collapsible from 'react-collapsible';

import CenterSlider from './slider.jsx';


const PackageDetails = ({packageInst, apiUri}) => {
  console.log('>>>>PackageDetails', {packageInst: packageInst, apiUri: apiUri});
  const packageImageUrl = apiUri + '/' + packageInst.imageUrl;

  let cityMap = _.groupBy(packageInst.items, function(item){return item.city});;
  console.log('>>>>PackageDetails city map', cityMap);

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
    </div>
  );
};

export default PackageDetails;
