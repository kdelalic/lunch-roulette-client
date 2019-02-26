import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Chip
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

const Restaurant = props => {
  const [showMap, setShowMap] = React.useState(false);

  const toggleShowMap = () => {
    setShowMap(!showMap);
  };
  const { restaurantInfo, userCoords } = props;
  const { name, rating, coordinates, image_url: imageURL, categories } = restaurantInfo;

  return (
    <Card className="restaurantCard">
      <CardHeader
        title={name}
        subheader={<img className="rating" alt={`${rating}/5 Stars`} src={starAssetSrc(rating)} />}
      />
      <CardMedia className="restaurantMedia" image={imageURL} title="Paella dish" />
      <CardContent className="restaurantContent">
        {categories.map(category => {
          return <Chip label={category.title} className="categoryChip" />;
        })}
      </CardContent>
      <CardActions className="actions" disableActionSpacing>
        <IconButton
          className={`expand ${showMap ? 'showMap' : 'hideMap'}`}
          onClick={toggleShowMap}
          aria-expanded={showMap}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={showMap}>
        <Map restaurantCoords={coordinates} userCoords={userCoords} />
      </Collapse>
    </Card>
  );
};

const { string, number, objectOf, oneOfType, bool, array } = PropTypes;

Restaurant.defaultProps = {
  restaurantInfo: {},
  userCoords: {}
};

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
  ),
  userCoords: objectOf(number)
};

export default Restaurant;
