// Components
import React, {createElement, useEffect} from 'react';
import Button from '@material-ui/core/Button';
// Variables
export default function ButtonExtent(props) {
  const btnPeople = React.useRef();
  useEffect(() => {
    if (props.defaultClick) {
      console.log('>>>>ButtonExtent.useEffect');
      btnPeople.current.click();
    }
  });
  return (
    <Button
      variant='contained'
      color='primary'
      fullWidth={!!props.fullWidth}
      onClick={() => {
        props.onClick(this.btnPeople.current);
      }}
      ref={btnPeople}
    >
      {props.title}
    </Button>
  );
}
