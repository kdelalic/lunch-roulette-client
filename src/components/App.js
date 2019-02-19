import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { BASE_SERVER_URL, LIMIT, RESTAURANT_RESET, DEVELOPMENT_MODE } from '../utils/config';
import Logger from '../utils/logger';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    if (DEVELOPMENT_MODE) {
      this.logger = new Logger();
    }

    // window.localStorage.clear();

    let prevOffset;
    let prevRestaurants;

    try {
      // Previous offset in the list of restaurants
      prevOffset = parseInt(window.localStorage.getItem('prevOffset'), 10);
    } catch (err) {
      this.logger.error('parseInt for prevOffset', err);
    }

    try {
      // List of previous restaurants
      prevRestaurants = JSON.parse(window.localStorage.getItem('prevRestaurants'));
    } catch (err) {
      this.logger.info('JSON.parse for prevRestaurants error', err);
    }

    this.logger.info('prevOffset', prevOffset);
    this.logger.info('prevRestaurants', prevRestaurants);

    this.state = {
      offset: isNaN(prevOffset) || prevOffset > RESTAURANT_RESET ? 0 : prevOffset,
      limit: LIMIT,
      restaurants: [],
      fetching: false,
      prevRestaurants: prevRestaurants || []
    };

    const { offset } = this.state;
    this.logger.info('offset', offset);
  }

  // Gets geolocation info
  getLocation = () => {
    // Checks if geolocation feature exists in browser
    if (navigator.geolocation) {
      // Sets message state for getting geolocation
      this.setState(
        {
          message: 'Getting geolocation info...'
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
                    message: 'Getting restaurant information...',
                    offset,
                    restaurants
                  };
                },
                () => {
                  const { coords } = this.state;
                  // Stores current coordinates in localStorage for next session
                  window.localStorage.setItem('prevCoords', JSON.stringify(coords));
                  // Loads restaurants into app
                  this.fetchRestaurants(true)
                    .then(() => {
                      // Displays next restaurants after restaurants are done loading
                      this.getNextRestaurant();
                    })
                    .catch(err => {
                      this.logger.info('fetchRestaurants', err);
                    });
                }
              );
            },
            error => {
              let message;

              // Geolocation get errors
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  message = 'User denied the request for Geolocation.';
                  break;
                case error.POSITION_UNAVAILABLE:
                  message = 'Location information is unavailable.';
                  break;
                case error.TIMEOUT:
                  message = 'The request to get user location timed out.';
                  break;
                case error.UNKNOWN_ERROR:
                  message = 'An unknown error occurred.';
                  break;
                default:
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
        message: 'Geolocation is not supported by this browser.'
      });
    }
  };

  // Makes API call to backend to fetch restaurants in bulk
  fetchRestaurants = firstLoad => {
    const { coords, offset, limit } = this.state;
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${BASE_SERVER_URL}/api/restaurants` +
            `?latitude=${coords.latitude}` +
            `&longitude=${coords.longitude}` +
            `&offset=${offset}` +
            `&limit=${limit}`
        )
        .then(res => {
          this.setState(
            prevState => {
              let { prevRestaurants } = prevState;
              // Sets previous offset in local storage
              window.localStorage.setItem('prevOffset', prevState.offset);

              let restaurants;

              if (firstLoad) {
                // On first restaurant load this filters out the previous
                // restaurants from the potential ones that can be showed to user
                restaurants = res.data.filter(value => {
                  return !prevRestaurants.includes(value.id);
                });
              } else {
                // If not first load, sets restaurants to response
                restaurants = res.data;
                prevRestaurants = [];
              }

              return {
                restaurants: restaurants.concat(prevState.restaurants),
                message: null,
                fetching: false,
                offset: prevState.offset + prevState.limit,
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
    const { message, restaurants, fetching, limit, prevRestaurants } = this.state;

    // If number of restaurants in state are less than 20% of limit,
    // then more restaurants are loaded into the state
    if (!message && restaurants.length <= Math.round(limit * 0.2) && !fetching) {
      this.setState(
        {
          fetching: true
        },
        () => {
          this.getNextRestaurant();
          this.fetchRestaurants();
        }
      );
    } else {
      // Random number used to pick random restaurant from restaurant array in state
      const randomNumber = this.getRandomNumber(restaurants.length);
      const restaurant = restaurants[randomNumber];

      prevRestaurants.push(restaurant.id);

      // Updates previous restaurants in local storage
      window.localStorage.setItem('prevRestaurants', JSON.stringify(prevRestaurants));

      this.setState(
        prevState => ({
          restaurant: {
            name: restaurant.name,
            rating: restaurant.rating,
            location: restaurant.location.address1
          },
          // Filters out current restaurant from potential restaurants
          restaurants: prevState.restaurants.filter((_, i) => i !== randomNumber),
          message: null,
          prevRestaurants
        }),
        () => {
          this.logger.trace('restaurants', JSON.stringify(restaurants));
        }
      );
    }
  };

  // Random number generator
  getRandomNumber = max => {
    return Math.floor(Math.random() * max);
  };

  render() {
    const { message, coords, restaurant } = this.state;
    // Initial state
    if (!message && !coords) {
      return (
        <div className="App">
          <Button
            id="show-restaurants"
            onClick={this.getLocation}
            variant="contained"
            color="primary"
          >
            Show nearby restaurants
          </Button>
        </div>
      );
      // State where there is a restaurant loaded
    }
    if (!message && restaurant) {
      return (
        <div className="App">
          <h2>{restaurant.name}</h2>
          <h2>{restaurant.rating}</h2>
          <h2>{restaurant.location}</h2>
          <Button onClick={this.getNextRestaurant} variant="contained" color="primary">
            Shuffle
          </Button>
        </div>
      );
      // Message state
    }
    return (
      <div className="App">
        <h2 id="message">{message}</h2>
      </div>
    );
  }
}

export default App;
