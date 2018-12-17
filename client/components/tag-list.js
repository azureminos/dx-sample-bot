import React, {createElement} from 'react';
import {WithContext as ReactTags} from 'react-tag-input';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class TagList extends React.Component {
  render() {
    const {tags, suggestions, title, isReadonly, handleDelete, handleAddition, handleDrag} = this.props;

    const settings = {
      tags: tags,
      delimiters: delimiters,
      readOnly: isReadonly || false,
    };

    if (!isReadonly) {
      settings.suggestions = suggestions;
      settings.handleDelete = handleDelete;
      settings.handleAddition = handleAddition;
      settings.handleDrag = handleDrag;
    }

    return (
        <div style={{'margin-bottom': 8}}>
            <span>{title || ''}</span>
            <ReactTags{...settings} />
        </div>
    )
  }
};

export default TagList;
