import React, { Component } from 'react';
import Logger from '../utils/logger';

import userMarker from '../images/user-marker.png';
import restaurantMarker from '../images/restaurant-marker.png';

import './Marker.css';

class Marker extends Component {
  constructor(props) {
    super(props);

    this.logger = new Logger();
  }

  render() {
    let image;

    if (this.props.user) {
      image = <img alt="User Location" src={userMarker} className="userMarker" />;
    } else if (this.props.restaurant) {
      image = <img alt="Restaurant Location" src={restaurantMarker} className="restaurantMarker" />;
    }

    return image;
  }
}

export default Marker;
