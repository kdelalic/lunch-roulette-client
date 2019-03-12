import React, { Fragment, useState } from 'react';
import { Button, Drawer, IconButton, Paper, Tooltip } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import {
  ArrowBackRounded,
  InfoOutlined,
  RefreshRounded,
  SettingsRounded
} from '@material-ui/icons';
import PropTypes from 'prop-types';

import { INNER_CONTAINER_ELEVATION, DEFAULT_RADIUS } from '../utils/config';
import './OptionsPanel.css';

const OptionsPanel = props => {
  const { setRadiusAPI } = props;
  const [radius, setRadiusSlider] = useState(DEFAULT_RADIUS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [optionsTouched, setOptionsTouched] = useState(false);

  const handleSlider = (event, value) => {
    setRadiusSlider(value);
  };

  const handleSliderDragEnd = () => {
    setRadiusAPI(radius);
    setOptionsTouched(true);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const reloadRestaurants = () => {
    setOptionsTouched(false);
  };

  return (
    <Drawer
      className="OptionsPanelContainer"
      classes={{ paper: drawerOpen ? 'open' : 'closed' }}
      open={drawerOpen}
      variant="permanent"
    >
      <div className="header">
        {drawerOpen && <h2>Options</h2>}
        <IconButton className="settings-button" onClick={toggleDrawer}>
          {drawerOpen ? <ArrowBackRounded /> : <SettingsRounded />}
        </IconButton>
      </div>

      <div className="options">
        <Paper elevation={INNER_CONTAINER_ELEVATION}>
          <div className="radius-control">
            {drawerOpen && (
              <Fragment>
                <div className="option-value">
                  <span>{`Radius: ${radius} meters`}</span>
                  <Tooltip title="Suggested search radius in meters" placement="right">
                    <InfoOutlined className="info-icon" />
                  </Tooltip>
                </div>

                <Slider
                  className="slider"
                  value={radius}
                  onChange={handleSlider}
                  onDragEnd={handleSliderDragEnd}
                  min={500}
                  max={10000}
                  step={100}
                />
              </Fragment>
            )}
          </div>
        </Paper>
      </div>

      {drawerOpen && (
        <div className="reload-button-div">
          <Button
            onClick={reloadRestaurants}
            className="action-button reload-button"
            variant="contained"
            disabled={!optionsTouched}
          >
            <span className="action-button-text">Apply options</span>
            <RefreshRounded />
          </Button>
        </div>
      )}
    </Drawer>
  );
};

OptionsPanel.propTypes = {
  setRadiusAPI: PropTypes.func.isRequired
};

export default OptionsPanel;
