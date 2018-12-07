import React, {createElement} from 'react';
import {WithContext as ReactTags} from 'react-tag-input';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class TagList extends React.Component {
  render() {
    const {tags, suggestions, title='My Tags', isReadonly=false, handleDelete, handleAddition, handleDrag} = this.props;

    const settings = {
      tags: tags,
      delimiters: delimiters,
      readOnly: isReadonly,
    };

    if (!isReadonly) {
      settings.suggestions = suggestions;
      settings.handleDelete = handleDelete;
      settings.handleAddition = handleAddition;
      settings.handleDrag = handleDrag;
    }

    return (
        <div>
            <span>{title}</span>
            <ReactTags{...settings} />
        </div>
    )
  }
};

export default TagList;
