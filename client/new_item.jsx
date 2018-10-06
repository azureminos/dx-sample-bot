/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import React, {createElement} from 'react';
import {Cell, CellBody, CellHeader, Select} from 'react-weui';

const SCROLL_DURATION = 1000; // total duration in ms for scroll animation.

/**
 * lockScroll — Force scrollY position to bottom of viewport for duration.
 * @param   {Number} startTime - Start Time for locking scroll duration.
 * @returns {Undefined} .
 */
const lockScroll = (startTime) => {
  const deltaTime = Date.now() - startTime;
  const htmlElement = document.documentElement;
  const {scrollTo, scrollX, innerHeight} = window;

  scrollTo(scrollX, htmlElement.offsetHeight - innerHeight);

  if (deltaTime <= SCROLL_DURATION) {
    window.requestAnimationFrame(() => lockScroll(startTime));
  }
};

// The NewItem Input Field Component
const NewItem = ({
  addNewItem,
  disabled,
  newItemText,
  resetting,
  setNewItemText,
}) => {
  const onSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!disabled && newItemText.length > 0) {
      addNewItem();
      lockScroll(Date.now());
    }
  };

  const classes = resetting ? 'resetting' : null; // For wipe animation

  const options = [
    {value: 1, label: 'Beijing'},
    {value: 2, label: 'Shanghai'},
    {value: 3, label: 'Xiamen'}
  ];

  return (
    <Cell id='new-item'>
      <CellHeader id='input-indicator' onClick={onSubmit}>
        <div className='weui-uploader__input-box' />
      </CellHeader>

      <CellBody>
        <form action onSubmit={onSubmit}>
          <Select
            className={classes}
            disabled={disabled}
            id='new-item-text'
            onChange={(event) => setNewItemText(event.target.value)}
            data={options}
            defaultValue='3'/>
        </form>
      </CellBody>
    </Cell>
  );
};

NewItem.proptypes = {
  addNewItem: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  newItemText: React.PropTypes.string,
  setNewItemText: React.PropTypes.func.isRequired,
};

export default NewItem;
