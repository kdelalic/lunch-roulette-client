import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse, FormControlLabel, Switch } from '@material-ui/core';

import Map from './Map';
import './Restaurant.css';

const starAssets = require.context('../images/yelp_assets/stars/web_and_ios/regular/', true);

const starAssetSrc = rating => {
  let fileName;
  if (rating - Math.floor(rating) !== 0) {
    fileName = `${Math.floor(rating)}_half`;
  } else {
    fileName = rating;
  }
  return starAssets(`./regular_${fileName}.png`);
};

class Restaurant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMap: false
    };
  }

  toggleShowMap = () => event => {
    this.setState({ showMap: event.target.checked });
  };

  render() {
    const { showMap } = this.state;
    const { restaurantInfo, userCoords } = this.props;
    const { name, rating, location, coords } = restaurantInfo;
    return (
      <div className="Restaurant">
        <h2 className="name">
          {name}
          <img className="rating" alt={`${rating}/5 Stars`} src={starAssetSrc(rating)} />
        </h2>
        <h3>
          {/* eslint-disable-next-line */}
          Address: {location}
        </h3>
        <FormControlLabel
          control={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <Switch
              checked={showMap}
              onChange={this.toggleShowMap()}
              value="showMap"
              color="primary"
            />
          }
          label="Show map"
        />
        <Collapse in={showMap}>
          <Map restaurantCoords={coords} userCoords={userCoords} />
        </Collapse>
      </div>
    );
  }
}

const { string, number, objectOf, oneOfType } = PropTypes;

Restaurant.defaultProps = {
  restaurantInfo: {},
  userCoords: {}
};

Restaurant.propTypes = {
  restaurantInfo: objectOf(oneOfType([string, number, objectOf(number)])),
  userCoords: objectOf(number)
};

export default Restaurant;
