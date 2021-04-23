// Components
import React, {createElement, useEffect} from 'react';
import Button from '@material-ui/core/Button';
// Variables
export default function ButtonExtent() {
  const btnPeople = React.useRef();
  useEffect(() => {
    if (this.props.defaultClick) {
      btnPeople.current.handleClick();
    }
  });
  return (
    <Button
      variant='contained'
      color='primary'
      fullWidth={!!this.props.fullWidth}
      onClick={this.props.onClick}
      ref={btnPeople}
    >
      {this.props.title}
    </Button>
  );
}
