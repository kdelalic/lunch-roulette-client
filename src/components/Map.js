import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import { Button } from '@material-ui/core';
import ShuffleRounded from '@material-ui/icons/ShuffleRounded';

import Logo from './Logo';
import Marker from './Marker';
import './Map.css';
import { DEFAULT_MAP_ZOOM, GOOGLE_MAPS_API_KEY } from '../utils/config';

const Map = props => {
  const { getNextRestaurant, restaurantCoords, userCoords } = props;

  return (
    <div className="MapComponent">
      <Logo />
      <GoogleMapReact
        className="google-map"
        bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
        center={[restaurantCoords.latitude, restaurantCoords.longitude]}
        defaultZoom={DEFAULT_MAP_ZOOM}
      >
        <Marker
          type="restaurant"
          lat={restaurantCoords.latitude}
          lng={restaurantCoords.longitude}
        />
        <Marker type="user" lat={userCoords.latitude} lng={userCoords.longitude} />
      </GoogleMapReact>
      <Button
        className="action-button shuffle-button"
        onMouseDown={getNextRestaurant}
        variant="contained"
        color="primary"
      >
        <span className="action-button-text">Shuffle</span>
        <ShuffleRounded />
      </Button>
    </div>
  );
};

const { objectOf, number } = PropTypes;

Map.propTypes = {
  getNextRestaurant: PropTypes.func.isRequired,
  restaurantCoords: objectOf(number).isRequired,
  userCoords: objectOf(number).isRequired
};

export default Map;
