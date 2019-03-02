import React from 'react';
import { Button, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';

import './OptionsPanel.css';

const OptionsPanel = props => {
  const { getNextRestaurant } = props;

  return (
    <Paper className="OptionsPanel" elevation={1}>
      <div className="logo">
        <h1>Lunch Roulette</h1>
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

OptionsPanel.propTypes = {
  getNextRestaurant: PropTypes.func.isRequired
};

export default OptionsPanel;
