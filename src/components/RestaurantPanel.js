import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, Chip, Paper } from '@material-ui/core';
import YelpBurst from '../images/yelp_assets/burst/Yelp_burst_positive_RGB.png';

import Review from './Review';
import Logger from '../utils/logger';
import { BASE_SERVER_URL } from '../utils/config';
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

class RestaurantPanel extends Component {
  logger = new Logger();

  state = {
    reviews: undefined
  };

  loadReviews = () => {
    const { restaurantInfo } = this.props;
    axios
      .get(`${BASE_SERVER_URL}/api/reviews/${restaurantInfo.id}`)
      .then(res => {
        console.log(res.data.reviews);
        this.setState({
          reviews: res.data.reviews
        });
      })
      .catch(err => {
        this.logger.error('loadReviews', err);
      });
  };

  render() {
    const { restaurantInfo } = this.props;
    const { reviews } = this.state;
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
              <div className="price">{price}</div>
            </div>
            <div className="categories">
              {categories.map(category => {
                return (
                  <Chip label={category.title} key={category.alias} className="categoryChip" />
                );
              })}
            </div>
          </Paper>
        </div>
        <div className="reviews">
          <Paper elevation={containerElevation}>
            {reviews ? (
              reviews.map(review => {
                return <Review key={review.id} reviewInfo={review} />;
              })
            ) : (
              <Button
                id="load-reviews"
                className="actionButton"
                onClick={this.loadReviews}
                variant="contained"
                color="primary"
              >
                Load Reviews
              </Button>
            )}
          </Paper>
        </div>
      </Paper>
    );
  }
}

const { string, number, bool, array, shape } = PropTypes;

RestaurantPanel.propTypes = {
  restaurantInfo: shape({
    categories: array,
    coordinates: shape({
      latitude: number,
      longitude: number
    }),
    distance: number,
    id: string,
    image_url: string,
    is_closed: bool,
    location: shape({
      display_address: array
    }),
    name: string,
    phone: string,
    price: string,
    rating: number,
    review_count: number,
    url: string
  }).isRequired
};

export default RestaurantPanel;
