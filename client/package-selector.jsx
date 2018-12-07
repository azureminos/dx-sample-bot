import React, {createElement} from 'react';
import SuperSlider from './super-slider.jsx';

const PackageSelector = ({packages, bookPackage, apiUri}) => {
  console.log('>>>>PackageSelector', {packages: packages, apiUri: apiUri});
  const btnActions = [{'View Details': bookPackage}];
  return (
    <SuperSlider
      items={packages}
      btnActions={btnActions}
      apiUri={apiUri}
    />
  );
};

export default PackageSelector;
