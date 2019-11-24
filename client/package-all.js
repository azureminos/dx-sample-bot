import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PackageCard from './components/package-card';
// ====== Icons ======
// Variables
const styles = (theme) => ({
  root: {},
});

class PackageAll extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('>>>>PackageAll, render()', this.props);
    const {classes, packages, viewerId, pushToRemote} = this.props;
    // Local Variables
    // Sub Components
    const bricks = _.map(packages, (p) => {
      const handleViewPackage = () => {
        const instance = {
          packageId: p.id,
          totalDays: p.totalDays,
          carOption: p.carOption,
          isCustomised: false,
          owner: viewerId,
        };
        pushToRemote('package:create', instance);
      };
      return (
        <PackageCard
          key={p.id}
          product={p}
          handleViewPackage={handleViewPackage}
        />
      );
    });
    // Display Widget
    return <div>{bricks}</div>;
  }
}

export default withStyles(styles)(PackageAll);
