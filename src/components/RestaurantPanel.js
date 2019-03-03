import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Chip, Paper } from '@material-ui/core';
import Money from '@material-ui/icons/AttachMoney';
import YelpBurst from '../images/yelp_assets/burst/Yelp_burst_positive_RGB.png';

import './RestaurantPanel.css';

const containerElevation = 1;

const starAssets = require.context('../images/yelp_assets/stars/web_and_ios/large/', true);

const starAssetSrc = rating => {
  let fileName;
  if (rating - Math.floor(rating) !== 0) {
    fileName = `${Math.floor(rating)}_half`;
  } else {
    fileName = rating;
  }
  return starAssets(`./large_${fileName}.png`);
};

const RestaurantPanel = props => {
  const { restaurantInfo } = props;
  const {
    name,
    rating,
    review_count: reviewCount,
    image_url: imageURL,
    categories,
    url,
    price
  } = restaurantInfo;

  return (
    <Paper className="RestaurantPanel" elevation={2}>
      <div className="header">
        <h2>
          {name}
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img alt="View on Yelp" src={YelpBurst} />
          </a>
        </h2>
      </div>
      <div className="media">
        <Paper elevation={containerElevation}>
          <img src={imageURL} alt={name} />
        </Paper>
      </div>
      <div className="content">
        <Paper elevation={containerElevation}>
          <div className="ratingPrice">
            <div className="rating">
              <img alt={`${rating}/5 Stars`} src={starAssetSrc(rating)} />
              <span>{`${reviewCount} reviews`}</span>
            </div>
            <div className="price">
              {price ? (
                _.times(price.length, i => {
                  return <Money viewBox="6 3 11 19" key={i} />;
                })
              ) : (
                <div />
              )}
            </div>
          </div>
          <div className="categories">
            {categories.map(category => {
              return <Chip label={category.title} key={category.alias} className="categoryChip" />;
            })}
          </div>
        </Paper>
      </div>
    </Paper>
  );
};

const { string, number, objectOf, oneOfType, bool, array } = PropTypes;

RestaurantPanel.propTypes = {
  restaurantInfo: objectOf(
    oneOfType([
      array,
      bool,
      string,
      number,
      objectOf(number),
      objectOf(string),
      objectOf(oneOfType(string, array, number))
    ])
  ).isRequired
};

export default RestaurantPanel;
