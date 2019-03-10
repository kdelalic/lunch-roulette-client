import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, Chip, Modal, Paper, Tooltip } from '@material-ui/core';
import { Home, Phone, RateReviewOutlined } from '@material-ui/icons';

import Review from './Review';
import YelpBurst from '../images/yelp_assets/burst/Yelp_burst_positive_RGB.png';
import { getStarAssetSrc } from '../utils/common';
import Logger from '../utils/logger';
import { INNER_CONTAINER_ELEVATION, API } from '../utils/config';
import './RestaurantPanel.css';

class RestaurantPanel extends Component {
  logger = new Logger();

  state = {
    reviews: null,
    showReviews: false,
    loadingReviews: false,
    mediaModalOpen: false
  };

  handleViewReviews = () => {
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
            .get(API.GET.REVIEWS(restaurantInfo.id))
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

  handleOpenMediaModal = () => {
    this.setState({ mediaModalOpen: true });
  };

  handleCloseMediaModal = () => {
    this.setState({ mediaModalOpen: false });
  };

  render() {
    const { restaurantInfo } = this.props;
    const { reviews, showReviews, mediaModalOpen } = this.state;
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
      <Paper className="RestaurantPanelContainer" elevation={2}>
        <div className="header">
          <h2>
            {name}
            <Tooltip title="View on Yelp" aria-label="View on Yelp" placement="right">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <img className="yelp-burst" alt="View on Yelp" src={YelpBurst} />
              </a>
            </Tooltip>
          </h2>
        </div>
        <div className="media">
          <Paper onClick={this.handleOpenMediaModal} elevation={INNER_CONTAINER_ELEVATION}>
            <img src={imageURL} alt={name} />
          </Paper>
          <Modal
            onClick={this.handleCloseMediaModal}
            className="mediaModal"
            open={mediaModalOpen}
            onClose={this.handleCloseMediaModal}
          >
            <img src={imageURL} alt={name} />
          </Modal>
        </div>
        <div className="content">
          <Paper elevation={INNER_CONTAINER_ELEVATION}>
            <div className="header">
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
                  <Chip label={category.title} key={category.alias} className="category-chip" />
                );
              })}
            </div>
          </Paper>
        </div>
        <div className="reviews">
          <Paper elevation={INNER_CONTAINER_ELEVATION}>
            {showReviews && reviews ? (
              reviews.map(review => {
                return <Review key={review.id} reviewInfo={review} />;
              })
            ) : (
              <Button
                size="small"
                onMouseOver={this.loadReviews}
                onFocus={this.loadReviews}
                onClick={this.handleViewReviews}
                variant="outlined"
                className="view-reviews-button"
              >
                View Reviews
                <RateReviewOutlined />
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
