import React, { useState } from 'react';
import { Drawer, IconButton, Paper, Tooltip } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import { InfoOutlined, SettingsRounded, ArrowBackRounded } from '@material-ui/icons';
import PropTypes from 'prop-types';

import { INNER_CONTAINER_ELEVATION, DEFAULT_RADIUS } from '../utils/config';
import './OptionsPanel.css';

const OptionsPanel = props => {
  const { setRadiusAPI } = props;
  const [radius, setRadiusSlider] = useState(DEFAULT_RADIUS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSlider = (event, value) => {
    setRadiusSlider(value);
  };

  const handleSliderDragEnd = () => {
    setRadiusAPI(radius);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Drawer
      className="OptionsPanelComponent"
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
            <span>
              Radius
              <Tooltip title="Suggested search radius in meters" placement="right">
                <InfoOutlined className="info-icon" />
              </Tooltip>
            </span>

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
    </Drawer>
  );
};

OptionsPanel.propTypes = {
  setRadiusAPI: PropTypes.func.isRequired
};

export default OptionsPanel;
