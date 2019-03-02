import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Chip, Paper } from '@material-ui/core';
import Money from '@material-ui/icons/AttachMoney';
import YelpBurst from '../images/yelp_assets/burst/Yelp_burst_positive_RGB.png';

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

const Restaurant = props => {
  const { restaurantInfo } = props;
  const { name, rating, image_url: imageURL, categories, url, price } = restaurantInfo;

  return (
    <Paper className="Restaurant" elevation={2}>
      <div className="header">
        <h2>
          {name}
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img alt="View on Yelp" src={YelpBurst} />
          </a>
        </h2>
      </div>
      <div className="container">
        <Paper className="media" elevation={1}>
          <img src={imageURL} alt={name} />
        </Paper>
      </div>
      <div className="container">
        <Paper className="content" elevation={1}>
          <img className="rating" alt={`${rating}/5 Stars`} src={starAssetSrc(rating)} />
          <div className="categories">
            {categories.map(category => {
              return <Chip label={category.title} key={category.alias} className="categoryChip" />;
            })}
          </div>
          <div className="price">
            {price ? (
              _.times(price.length, i => {
                return <Money key={i} />;
              })
            ) : (
              <div />
            )}
          </div>
        </Paper>
      </div>
    </Paper>
  );
};

const { string, number, objectOf, oneOfType, bool, array } = PropTypes;

Restaurant.propTypes = {
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

export default Restaurant;
