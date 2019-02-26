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
  Typography
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
  const { name, rating, coords, imageURL } = restaurantInfo;

  return (
    <Card className="restaurantCard">
      <CardHeader
        title={name}
        subheader={<img className="rating" alt={`${rating}/5 Stars`} src={starAssetSrc(rating)} />}
      />
      <CardMedia className="restaurantMedia" image={imageURL} title="Paella dish" />
      <CardContent>
        <Typography component="p">
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Typography>
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
        <Map restaurantCoords={coords} userCoords={userCoords} />
      </Collapse>
    </Card>
    // <div className="Restaurant">
    //   <h2 className="name">
    //     {name}
    //     <img className="rating" alt={`${rating}/5 Stars`} src={starAssetSrc(rating)} />
    //   </h2>
    //   <h3>
    //     {/* eslint-disable-next-line */}
    //     Address: {location}
    //   </h3>
    //   <FormControlLabel
    //     control={
    //       // eslint-disable-next-line react/jsx-wrap-multilines
    //       <Switch
    //         checked={showMap}
    //         onChange={this.toggleShowMap()}
    //         value="showMap"
    //         color="primary"
    //       />
    //     }
    //     label="Show map"
    //   />
    //   <Collapse in={showMap}>
    //     <Map restaurantCoords={coords} userCoords={userCoords} />
    //   </Collapse>
    // </div>
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
