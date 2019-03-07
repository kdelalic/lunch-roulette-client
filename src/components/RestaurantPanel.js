import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, Chip, Paper, Tooltip } from '@material-ui/core';
import { Home, Phone } from '@material-ui/icons';

import Review from './Review';
import YelpBurst from '../images/yelp_assets/burst/Yelp_burst_positive_RGB.png';
import { getStarAssetSrc } from '../utils/common';
import Logger from '../utils/logger';
import { BASE_SERVER_URL } from '../utils/config';
import './RestaurantPanel.css';

const containerElevation = 1;

class RestaurantPanel extends Component {
  logger = new Logger();

  state = {
    reviews: null,
    showReviews: false,
    loadingReviews: false
  };

  onViewReviews = () => {
    this.setState({ showReviews: true });
  };

  loadReviews = () => {
    const { restaurantInfo } = this.props;
    const { loadingReviews, reviews } = this.state;

    if (!reviews && !loadingReviews) {
      this.setState(
        {
          loadingReviews: true
        },
        () => {
          axios
            .get(`${BASE_SERVER_URL}/api/reviews/${restaurantInfo.id}`)
            .then(res => {
              this.setState({
                reviews: res.data.reviews,
                loadingReviews: false
              });
            })
            .catch(err => {
              this.logger.error('loadReviews', err);
            });
        }
      );
    }
  };

  render() {
    const { restaurantInfo } = this.props;
    const { reviews, showReviews } = this.state;
    const {
      name,
      rating,
      review_count: reviewCount,
      image_url: imageURL,
      categories,
      url,
      price,
      location,
      display_phone: displayPhone
    } = restaurantInfo;

    return (
      <Paper className="RestaurantPanel" elevation={2}>
        <div className="header">
          <h2>
            {name}
            <Tooltip title="View on Yelp" aria-label="View on Yelp" placement="right">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <img alt="View on Yelp" src={YelpBurst} />
              </a>
            </Tooltip>
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
                <img alt={`${rating} star rating`} src={getStarAssetSrc(rating)} />
                <span>{`${reviewCount} reviews`}</span>
              </div>
              <div className="price">{price}</div>
            </div>
            <div className="contact">
              {location.display_address[0] && (
                <div className="address">
                  <Home />
                  {location.display_address[0]}
                </div>
              )}
              {displayPhone && (
                <div className="phone">
                  <Phone />
                  <a href={`tel:${displayPhone}`}>{displayPhone}</a>
                </div>
              )}
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
            {showReviews && reviews ? (
              reviews.map(review => {
                return <Review key={review.id} reviewInfo={review} />;
              })
            ) : (
              <Button
                size="small"
                onMouseOver={this.loadReviews}
                onFocus={this.loadReviews}
                onClick={this.onViewReviews}
                variant="outlined"
                aria-label="Reviews"
                className="viewReviewsButton"
              >
                View Reviews
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
