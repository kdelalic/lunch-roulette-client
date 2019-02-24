import React, { Component } from 'react';
import PropTypes from 'prop-types';

import userMarker from '../images/user-marker.png';
import restaurantMarker from '../images/restaurant-marker.png';

import './Marker.css';

class Marker extends Component {
  static defaultProps = {
    type: 'restaurant'
  };

  static propTypes = {
    type: PropTypes.string
  };

  render() {
    const { type } = this.props;
    let image;

    if (type === 'user') {
      image = <img alt="User Location" src={userMarker} className="userMarker" />;
    } else if (type === 'restaurant') {
      image = <img alt="Restaurant Location" src={restaurantMarker} className="restaurantMarker" />;
    }

    return image;
  }
}

export default Marker;
