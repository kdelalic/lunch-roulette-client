import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Paper
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
  const [showMap, setShowMap] = React.useState(false);

  const toggleShowMap = () => {
    setShowMap(!showMap);
  };
  const { restaurantInfo } = props;
  const { name, rating, image_url: imageURL, categories } = restaurantInfo;

  return (
    <Paper className="Restaurant">
      <div className="header">
        <h2>{name}</h2>
        <img className="rating" alt={`${rating}/5 Stars`} src={starAssetSrc(rating)} />
      </div>
      <img className="media" src={imageURL} alt={name} />
      <div className="content">
        {categories.map(category => {
          return <Chip label={category.title} className="categoryChip" />;
        })}
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
