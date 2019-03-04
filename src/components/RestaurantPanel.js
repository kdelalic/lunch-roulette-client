import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Collapse, Chip, Fab, Paper } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { throttle } from 'throttle-debounce';

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
    reviews: [],
    expandReviews: false
  };

  showReviews = () => {
    this.setState(prevState => ({ expandReviews: !prevState.expandReviews }));
  };

  loadReviews = () => {
    const { restaurantInfo } = this.props;
    const { reviews } = this.state;

    if (reviews.length <= 0) {
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
    }
  };

  render() {
    const { restaurantInfo } = this.props;
    const { reviews, expandReviews } = this.state;
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
                <img alt={`${rating}/5 Stars`} src={getStarAssetSrc(rating)} />
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
        <Fab
          size="small"
          onMouseOver={throttle(1000, this.loadReviews)}
          onFocus={throttle(1000, this.loadReviews)}
          onClick={this.showReviews}
          variant="extended"
          aria-label="Reviews"
          className="viewReviews"
        >
          View Reviews
          <ExpandMoreIcon className={`icon ${expandReviews && 'rotatedIcon'}`} />
        </Fab>
        <div className="reviews">
          <Paper elevation={containerElevation}>
            <Collapse in={expandReviews}>
              {reviews.map(review => {
                return <Review key={review.id} reviewInfo={review} />;
              })}
            </Collapse>
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
