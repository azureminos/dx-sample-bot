/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* ----------  External Libraries  ---------- */

import React from 'react';
import styled from "styled-components";
import Typography from '@material-ui/core/Typography';

const FooterContainer = styled.div`
display: flex;
flex-direction: column;
background: lightgrey;
`;

// Updating status indicator
const Updating = ({updating}) => {
  let updatingStatus = 'Changes saved';
  if (updating) {
    updatingStatus = <span><i className='weui-loading' /> Saving...</span>;
  }

  return (
    <FooterContainer>
      <Typography variant="caption">{updatingStatus}</Typography>
    </FooterContainer>
  );
};

Updating.propTypes = {
  updating: React.PropTypes.bool.isRequired,
};

export default Updating;
