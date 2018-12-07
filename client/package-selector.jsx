import React, {createElement} from 'react';
import SuperSlider from './super-slider.jsx';

const PackageSelector = ({packages, bookPackage, apiUri}) => {
  console.log('>>>>PackageSelector', {packages: packages, apiUri: apiUri});
  const btnActionMap = {'View Details': bookPackage};
  return (
    <SuperSlider
      items={packages}
      btnActionMap={btnActionMap}
      apiUri={apiUri}
    />
  );
};

export default PackageSelector;
