import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

import './Map.css';
import { DEFAULT_MAP_ZOOM, GOOGLE_MAPS_API_KEY } from '../utils/config';
import Logger from '../utils/logger';

class Map extends Component {
  static defaultProps = {
    restaurantCoords: {}
  };

  static propTypes = {
    restaurantCoords: PropTypes.objectOf(PropTypes.number)
  };

  constructor(props) {
    super(props);

    this.logger = new Logger();
  }

  render() {
    const { restaurantCoords } = this.props;

    return (
      <div className="MapComponent">
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
          center={restaurantCoords}
          defaultZoom={DEFAULT_MAP_ZOOM}
        />
      </div>
    );
  }
}

export default Map;
