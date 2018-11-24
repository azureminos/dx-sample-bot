import React, { Component } from "react";
import {Panel} from 'react-weui';
import SuperSlider from './super-slider.jsx';

const PackageSelector = ({packages, bookPackage, apiUri}) => {
  console.log('>>>>PackageSelector', {packages: packages, apiUri: apiUri});

  return (
    <div>
      <Panel>
        <SuperSlider
          items={packages}
          buttonName='View Details'
          buttonAction={bookPackage}
          apiUri={apiUri}
        />
      </Panel>
    </div>
  );
};

export default PackageSelector;
