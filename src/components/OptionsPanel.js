import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Paper,
  TextField,
  Tooltip
} from '@material-ui/core';
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
  const { setAPIOptions, reloadRestaurants } = props;
  const [radius, setRadiusSlider] = useState(DEFAULT_RADIUS);
  const [searchTerm, setSearchTerm] = useState(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [optionsApplied, setOptionsApplied] = useState(true);
  const [reloading, setReloading] = useState(false);

  const handleSlider = (event, value) => {
    setRadiusSlider(value);
  };

  const handleSliderDragEnd = () => {
    setOptionsApplied(false);
  };

  const handleSearchTerm = (event, value) => {
    setSearchTerm(value);
    setOptionsApplied(false);
  };

  const handleApplyOptions = () => {
    setAPIOptions(radius, searchTerm);
    setReloading(true);
    reloadRestaurants()
      .then(() => {
        setReloading(false);
        setOptionsApplied(true);
      })
      .catch(() => {
        setReloading(false);
        setOptionsApplied(true);
      });
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
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
        {drawerOpen && (
          <Paper elevation={INNER_CONTAINER_ELEVATION}>
            <div className="radius-control">
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
            </div>
            <div className="search-term-control">
              <TextField
                id="standard-search"
                label="Search term"
                type="search"
                onChange={handleSearchTerm}
                className="textfield"
                margin="dense"
                variant="outlined"
              />
            </div>
          </Paper>
        )}
      </div>

      {drawerOpen && (
        <div className="reload-button-wrapper">
          <Button
            onClick={handleApplyOptions}
            className="action-button reload-button"
            variant="contained"
            disabled={optionsApplied || reloading}
          >
            <span className="action-button-text">Apply options</span>
            <RefreshRounded />
          </Button>
          {reloading && (
            <div className="reload-progress-wrapper">
              <CircularProgress size={24} />
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
};

OptionsPanel.propTypes = {
  setAPIOptions: PropTypes.func.isRequired,
  reloadRestaurants: PropTypes.func.isRequired
};

export default OptionsPanel;
