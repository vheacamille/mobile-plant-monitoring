import React from 'react';
import Carousel from 'react-material-ui-carousel';
import GardenSlider from './gardenSlider.json';
import Item from './Item';

const GardenCarousel = () => {
  return (
    <Carousel>
      {
        GardenSlider.map((item, i) => <Item key={i} item={item} />)
      }
    </Carousel>

  )
}

export default GardenCarousel