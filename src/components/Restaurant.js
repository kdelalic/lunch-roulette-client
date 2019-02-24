import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import Map from './Map';
import './Restaurant.css';

const Restaurant = props => {
  const { restaurantInfo, getNextRestaurant } = props;
  const { name, rating, location, coords } = restaurantInfo;
  return (
    <div className="Restaurant">
      <h2>{name}</h2>
      <h2>
        {/* eslint-disable-next-line */}
        Rating: {rating}/5
      </h2>
      <h2>
        {/* eslint-disable-next-line */}
        Address: {location}
      </h2>
      <Map restaurantCoords={coords} userCoords={coords} />
      <Button
        className="actionButton"
        onClick={getNextRestaurant}
        variant="contained"
        color="primary"
      >
        Shuffle
      </Button>
    </div>
  );
};

const { string, number, objectOf, oneOfType } = PropTypes;

Restaurant.defaultProps = {
  restaurantInfo: {},
  getNextRestaurant: () => {}
};

Restaurant.propTypes = {
  restaurantInfo: objectOf(oneOfType([string, number, objectOf(number)])),
  getNextRestaurant: PropTypes.func
};

export default Restaurant;
