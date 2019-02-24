import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

import Marker from './Marker';
import './Map.css';
import { DEFAULT_MAP_ZOOM, GOOGLE_MAPS_API_KEY } from '../utils/config';

const Map = props => {
  const { restaurantCoords, userCoords } = props;

  return (
    <div className="MapComponent">
      <GoogleMapReact
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
    </div>
  );
};

Map.defaultProps = {
  restaurantCoords: {},
  userCoords: {}
};

Map.propTypes = {
  restaurantCoords: PropTypes.objectOf(PropTypes.number),
  userCoords: PropTypes.objectOf(PropTypes.number)
};

export default Map;
