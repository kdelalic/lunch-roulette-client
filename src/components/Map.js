import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

import Marker from './Marker';
import './Map.css';
import { DEFAULT_MAP_ZOOM, GOOGLE_MAPS_API_KEY } from '../utils/config';
import Logger from '../utils/logger';

class Map extends Component {
  static defaultProps = {
    restaurantCoords: {},
    userCoords: {}
  };

  static propTypes = {
    restaurantCoords: PropTypes.objectOf(PropTypes.number),
    userCoords: PropTypes.objectOf(PropTypes.number)
  };

  constructor(props) {
    super(props);

    this.logger = new Logger();
  }

  render() {
    const { restaurantCoords, userCoords } = this.props;

    return (
      <div className="MapComponent">
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
          center={[restaurantCoords.latitude, restaurantCoords.longitude]}
          defaultZoom={DEFAULT_MAP_ZOOM}
        >
          <Marker restaurant lat={restaurantCoords.latitude} lng={restaurantCoords.longitude} />
          <Marker user lat={userCoords.latitude} lng={userCoords.longitude} />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
