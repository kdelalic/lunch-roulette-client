import React, { useState } from 'react';
import { Button, Paper } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import PropTypes from 'prop-types';

import { INNER_CONTAINER_ELEVATION, DEFAULT_RADIUS } from '../utils/config';
import './OptionPanel.css';

const OptionPanel = props => {
  const { getNextRestaurant, setRadiusAPI } = props;
  const [radius, setRadiusSlider] = useState(DEFAULT_RADIUS);

  const handleSlider = (event, value) => {
    setRadiusSlider(value);
  };

  const handleSliderDragEnd = () => {
    setRadiusAPI(radius);
  };

  return (
    <Paper className="OptionPanel" elevation={2}>
      <div className="logo">
        <h1>Lunch Roulette</h1>
      </div>
      <div className="options">
        <Paper elevation={INNER_CONTAINER_ELEVATION}>
          <div className="radiusControl">
            <span>Radius</span>
            <Slider
              className="slider"
              value={radius}
              onChange={handleSlider}
              onDragEnd={handleSliderDragEnd}
              min={500}
              max={10000}
              step={100}
            />
          </div>
        </Paper>
      </div>
      <Button
        className="actionButton shuffleButton"
        onClick={getNextRestaurant}
        variant="contained"
        color="primary"
      >
        Shuffle
      </Button>
    </Paper>
  );
};

OptionPanel.propTypes = {
  getNextRestaurant: PropTypes.func.isRequired,
  setRadiusAPI: PropTypes.func.isRequired
};

export default OptionPanel;
