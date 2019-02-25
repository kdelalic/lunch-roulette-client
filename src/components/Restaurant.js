import React from 'react';
import PropTypes from 'prop-types';

import Map from './Map';
import './Restaurant.css';
import zero from '../images/yelp_assets/stars/web_and_ios/regular/regular_0.png';
import one from '../images/yelp_assets/stars/web_and_ios/regular/regular_1.png';
import oneHalf from '../images/yelp_assets/stars/web_and_ios/regular/regular_1_half.png';
import two from '../images/yelp_assets/stars/web_and_ios/regular/regular_2.png';
import twoHalf from '../images/yelp_assets/stars/web_and_ios/regular/regular_2_half.png';
import three from '../images/yelp_assets/stars/web_and_ios/regular/regular_3.png';
import threeHalf from '../images/yelp_assets/stars/web_and_ios/regular/regular_3_half.png';
import four from '../images/yelp_assets/stars/web_and_ios/regular/regular_4.png';
import fourHalf from '../images/yelp_assets/stars/web_and_ios/regular/regular_4_half.png';
import five from '../images/yelp_assets/stars/web_and_ios/regular/regular_5.png';

const starSwitch = rating => {
  let ratingImage;
  switch (rating) {
    case 0:
      ratingImage = zero;
      break;
    case 1:
      ratingImage = one;
      break;
    case 1.5:
      ratingImage = oneHalf;
      break;
    case 2:
      ratingImage = two;
      break;
    case 2.5:
      ratingImage = twoHalf;
      break;
    case 3:
      ratingImage = three;
      break;
    case 3.5:
      ratingImage = threeHalf;
      break;
    case 4:
      ratingImage = four;
      break;
    case 4.5:
      ratingImage = fourHalf;
      break;
    case 5:
      ratingImage = five;
      break;
    default:
      ratingImage = zero;
  }

  return ratingImage;
};

const Restaurant = props => {
  const { restaurantInfo, userCoords } = props;
  const { name, rating, location, coords } = restaurantInfo;

  return (
    <div className="Restaurant">
      <h2 className="name">
        {name}
        <img className="rating" alt={`${rating}/5 Stars`} src={starSwitch(rating)} />
      </h2>
      <h3>
        {/* eslint-disable-next-line */}
        Address: {location}
      </h3>
      <Map restaurantCoords={coords} userCoords={userCoords} />
    </div>
  );
};

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
