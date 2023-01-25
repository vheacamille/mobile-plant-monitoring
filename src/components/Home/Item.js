import { Paper } from '@mui/material';
import React from 'react';

const Item = (props) => {
  return (
    <Paper>
      <img src={props.item.image} alt="" className="garden-carousel"/>
      <h2>{props.item.name}</h2>
      <p>{props.item.quote}</p>
      <i><p>{props.item.author}</p></i>
    </Paper>
  )
}

export default Item