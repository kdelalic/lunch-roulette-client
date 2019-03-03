import React from 'react';
import { Button, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';

import './OptionPanel.css';

const OptionPanel = props => {
  const { getNextRestaurant } = props;

  return (
    <Paper className="OptionPanel" elevation={2}>
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

OptionPanel.propTypes = {
  getNextRestaurant: PropTypes.func.isRequired
};

export default OptionPanel;
