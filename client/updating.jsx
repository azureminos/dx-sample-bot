/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* ----------  External Libraries  ---------- */

import React from 'react';
import PropTypes from 'prop-types';
import Footer from './footer';

// Updating status indicator
const Updating = ({updating}) => {
  let updatingStatus = 'Changes saved';
  if (updating) {
    updatingStatus = <span><i className='weui-loading' /> Saving...</span>;
  }

  return (
    <Footer>
      {updatingStatus}
    </Footer>
  );
};

Updating.propTypes = {
  updating: PropTypes.bool.isRequired,
};

export default Updating;
