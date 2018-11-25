import React, {createElement} from 'react';
import {Panel} from 'react-weui';
import Collapsible from 'react-collapsible';
import SuperSlider from './super-slider.jsx';

const PackageSelector = ({packages, bookPackage, apiUri}) => {
  console.log('>>>>PackageSelector', {packages: packages, apiUri: apiUri});

  const setting = {
    key: 1,
    trigger: 'Featured Packages',
    open: true,
  };

  return (
    <div>
      <Panel>
        <Collapsible {...setting} >
          <SuperSlider
            items={packages}
            buttonName='View Details'
            buttonAction={bookPackage}
            apiUri={apiUri}
          />
        </Collapsible>
      </Panel>
    </div>
  );
};

export default PackageSelector;
