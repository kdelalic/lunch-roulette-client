import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '@material-ui/core';

import { getStarAssetSrc } from '../utils/common';
import './Review.css';

const Review = props => {
  const { reviewInfo } = props;
  const { rating, text, time_created: timeCreated, url, user } = reviewInfo;
  const { image_url: imageUrl, name } = user;
  const firstLetter = name.substring(0, 1).toUpperCase();

  return (
    <div className="Review">
      <div className="header">
        {imageUrl ? (
          <Avatar alt={name} src={imageUrl} className="avatar" />
        ) : (
          <Avatar className="avatar">{firstLetter}</Avatar>
        )}
        {name}
        <img className="rating" alt={`${rating} star rating`} src={getStarAssetSrc(rating)} />
        <span className="timeCreated">{timeCreated.slice(0, timeCreated.indexOf(' '))}</span>
      </div>
      <div className="content">
        {text}
        <a className="readMore" href={url} target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      </div>
    </div>
  );
};

const { string, number, shape } = PropTypes;

Review.propTypes = {
  reviewInfo: shape({
    id: string.isRequired,
    rating: number.isRequired,
    text: string.isRequired,
    time_created: string.isRequired,
    url: string.isRequired,
    user: {
      image_url: string.isRequired,
      name: string.isRequired
    }.isRequired
  }).isRequired
};

export default Review;
