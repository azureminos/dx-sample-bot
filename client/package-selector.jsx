import React, {createElement} from 'react';
import SuperSlider from './super-slider.jsx';

const PackageSelector = ({packages, bookPackage, apiUri}) => {
  console.log('>>>>PackageSelector', {packages: packages, apiUri: apiUri});

  return (
    <SuperSlider
      items={packages}
      buttonName='View Details'
      buttonAction={bookPackage}
      apiUri={apiUri}
    />
  );
};

export default PackageSelector;
