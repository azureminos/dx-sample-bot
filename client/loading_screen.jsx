/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* ----------  External Libraries  ---------- */
import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";

// Simple loading spinner
export default function LoadingScreen() {
  return <div><CircularProgress />Loading...</div>;
}
