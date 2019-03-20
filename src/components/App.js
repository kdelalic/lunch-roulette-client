import React, { Component, Fragment } from 'react';
import { Button } from '@material-ui/core';
import { MyLocationRounded } from '@material-ui/icons';
import axios from 'axios';

import OptionsPanel from './OptionsPanel';
import Map from './Map';
import RestaurantPanel from './RestaurantPanel';
import Message from './Message';
import './App.css';
import {
  DEVELOPMENT_MODE,
  LIMIT,
  RESTAURANT_RESET,
  REFILL_THRESHOLD,
  DEFAULT_RADIUS,
  API
} from '../utils/config';
import Logger from '../utils/logger';
import { getRandomNumber } from '../utils/common';
import messages from '../messages/en';

class App extends Component {
  constructor(props) {
    super(props);

    // window.localStorage.clear();

    this.logger = new Logger();

    let prevOffset;
    let prevRestaurants;
    let offset;

    try {
      // Previous offset in the list of restaurants
      prevOffset = parseInt(window.localStorage.getItem('prevOffset'), 10);
    } catch (err) {
      this.logger.error('parseInt for prevOffset', err);
    }
    this.logger.info('prevOffset', prevOffset);

    // If there is no previous offset
    // or if the prevOffset is greater than the set limit,
    // then we reset it to 0
    // otherwise we use the prevOffset
    if (isNaN(prevOffset) || prevOffset >= RESTAURANT_RESET) {
      offset = 0;
      prevRestaurants = [];
    } else {
      offset = prevOffset;
    }
    this.logger.info('offset', offset);

    if (offset === 0) {
      prevRestaurants = [];
    } else {
      try {
        // List of previous restaurants
        prevRestaurants = JSON.parse(window.localStorage.getItem('prevRestaurants'));
      } catch (err) {
        this.logger.error('JSON.parse for prevRestaurants error', err);
      }
    }
    this.logger.info('number of prevRestaurants', prevRestaurants ? prevRestaurants.length : 0);

    this.state = {
      fetching: false,
      offset,
      radius: DEFAULT_RADIUS,
      prevRestaurants,
      restaurants: []
    };
  }

  // Gets geolocation info
  getLocation = () => {
    // Checks if geolocation feature exists in browser
    if (navigator.geolocation) {
      // Sets message state for getting geolocation
      this.setState(
        {
          message: messages.gettingGeo
        },
        () => {
          // Gets gps info
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;

              this.logger.info('latitude,longitude', latitude, longitude);

              // Sets geolocation state
              this.setState(
                prevState => {
                  let { offset, restaurants } = prevState;
                  let prevCoords = window.localStorage.getItem('prevCoords');

                  // Checks if previous gps location is different than
                  // current gps location by magnitude of ~1km
                  // Resets offset and restaurants list if true,
                  // otherwise we can reuse previous session's already fetched info
                  if (prevCoords) {
                    try {
                      prevCoords = JSON.parse(window.localStorage.getItem('prevCoords'));
                    } catch (err) {
                      this.logger.error('JSON.parse for prevCoords', err);
                    }
                    if (
                      Math.abs(latitude - prevCoords.latitude) > 0.01 ||
                      Math.abs(longitude - prevCoords.longitude) > 0.01
                    ) {
                      offset = 0;
                      restaurants = [];
                    }
                  }

                  return {
                    coords: {
                      latitude,
                      longitude
                    },
                    message: messages.gettingRestaurants,
                    offset,
                    restaurants
                  };
                },
                () => {
                  const { coords } = this.state;
                  // Stores current coordinates in localStorage for next session
                  window.localStorage.setItem('prevCoords', JSON.stringify(coords));
                  // Loads restaurants into app
                  this.fetchRestaurants(true, false)
                    .then(() => {
                      // Displays next restaurants after restaurants are done loading
                      this.getNextRestaurant();
                    })
                    .catch(err => {
                      this.logger.error('fetchRestaurants', err);
                    });
                }
              );
            },
            error => {
              let message;

              // Geolocation get errors
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  message = messages.geoPermissionDenied;
                  break;
                case error.POSITION_UNAVAILABLE:
                  message = messages.geoUnavailable;
                  break;
                case error.TIMEOUT:
                  message = messages.geoRequestTimeout;
                  break;
                default:
                  message = messages.unknownError;
                  break;
              }

              this.setState({
                message
              });
            }
          );
        }
      );
    } else {
      this.setState({
        message: messages.geoNotSupported
      });
    }
  };

  // Makes API call to backend to fetch restaurants in bulk
  fetchRestaurants = (firstLoad, reload) => {
    const { coords, offset, radius } = this.state;
    return new Promise((resolve, reject) => {
      axios
        .get(API.GET.RESTAURANTS(coords.latitude, coords.longitude, offset, LIMIT, radius))
        .then(res => {
          this.setState(
            prevState => {
              let { prevRestaurants } = prevState;

              let restaurants;
              let newOffset;

              // Sets previous offset in local storage
              window.localStorage.setItem('prevOffset', prevState.offset);

              if (firstLoad || reload) {
                // On first restaurant load this filters out the previous
                // restaurants from the potential ones that can be showed to user
                restaurants = res.data.filter(value => {
                  return !prevRestaurants.includes(value.id);
                });

                if (!restaurants) {
                  restaurants = res.data;
                }
              } else {
                // If not first load, sets restaurants to response
                restaurants = res.data;
              }

              if (prevState.offset >= RESTAURANT_RESET) {
                newOffset = 0;
                prevRestaurants = [];
              } else {
                newOffset = prevState.offset + LIMIT;
              }

              if (!reload) {
                restaurants = restaurants.concat(prevState.restaurants);
              }

              return {
                restaurants,
                message: null,
                fetching: false,
                offset: newOffset,
                prevRestaurants
              };
            },
            () => {
              resolve();
            }
          );
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  // Displays next restaurant
  getNextRestaurant = () => {
    const { message, restaurants, fetching, prevRestaurants } = this.state;

    // If number of restaurants in state are less than 20% of limit,
    // then more restaurants are loaded into the stat
    if (!message && restaurants.length <= Math.round(LIMIT * REFILL_THRESHOLD) && !fetching) {
      this.setState(
        {
          fetching: true,
          message: messages.gettingRestaurants
        },
        () => {
          if (restaurants.length > 0) {
            this.getNextRestaurant();
          }
          this.fetchRestaurants(false, false);
        }
      );
    } else {
      // Random number used to pick random restaurant from restaurant array in state
      const randomNumber = getRandomNumber(restaurants.length, 0);
      const restaurant = restaurants[randomNumber];

      prevRestaurants.push(restaurant.id);

      if (DEVELOPMENT_MODE) console.log(restaurant);

      // Updates previous restaurants in local storage
      window.localStorage.setItem('prevRestaurants', JSON.stringify(prevRestaurants));

      this.setState(
        prevState => ({
          restaurant,
          // Filters out current restaurant from potential restaurants
          restaurants: prevState.restaurants.filter((_, i) => i !== randomNumber),
          prevRestaurants
        }),
        () => {
          this.logger.info('number of restaurants', restaurants.length);
        }
      );
    }
  };

  setRadius = radius => {
    this.setState({ radius });
  };

  reloadRestaurants = () => {
    const { restaurants } = this.state;
    return new Promise((resolve, reject) => {
      this.fetchRestaurants(false, true)
        .then(() => {
          // Displays next restaurants after restaurants are done loading
          console.log(restaurants);

          this.getNextRestaurant();
          resolve();
        })
        .catch(err => {
          this.logger.error('fetchRestaurants', err);
          reject();
        });
    });
  };

  render() {
    const { message, restaurants } = this.state;
    let body;

    if (!message || restaurants.length > 0) {
      const { coords, restaurant } = this.state;

      if (restaurant) {
        // State where there is a restaurant loaded
        body = (
          <Fragment>
            <OptionsPanel
              setRadiusAPI={this.setRadius}
              reloadRestaurants={this.reloadRestaurants}
            />
            <Map
              getNextRestaurant={this.getNextRestaurant}
              restaurantCoords={restaurant.coordinates}
              userCoords={coords}
            />
            <RestaurantPanel key={restaurant.id} restaurantInfo={restaurant} />
          </Fragment>
        );
      }
      if (!coords) {
        // Initial state
        body = (
          <div className="initial-state">
            <Button
              id="show-restaurants"
              className="action-button"
              onClick={this.getLocation}
              variant="contained"
              color="primary"
            >
              <span className="action-button-text">Show nearby restaurants</span>
              <MyLocationRounded />
            </Button>
          </div>
        );
      }
    } else {
      // Message state
      body = <Message message={message} />;
    }

    return <div className="AppContainer">{body}</div>;
  }
}

export default App;
