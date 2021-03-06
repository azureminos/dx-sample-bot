// Components
import React, {createElement, useEffect} from 'react';
import Button from '@material-ui/core/Button';
// Variables
export default function ButtonExtent(props) {
  const btnPeople = React.useRef();
  useEffect(() => {
    if (props.defaultClick) {
      console.log('>>>>ButtonExtent.useEffect');
      props.onClick(btnPeople.current, false);
    }
  });
  return (
    <Button
      variant='contained'
      color='primary'
      fullWidth={!!props.fullWidth}
      onClick={() => {
        props.onClick(btnPeople.current, true);
      }}
      ref={btnPeople}
    >
      {props.title}
    </Button>
  );
}
