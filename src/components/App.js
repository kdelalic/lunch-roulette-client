import React, {Component} from "react";
import {Button} from "@material-ui/core";
import axios from "axios";
import "./App.css";

const BASE_SERVER_URL = process.env.SERVER_ORIGIN;
const LIMIT = 50;
const RESTAURANT_RESET = 900;

class App extends Component {
    constructor(props) {
        super(props);

        // window.localStorage.clear();

        // Previous offset in the list of restaurants
        const prevOffset = parseInt(window.localStorage.getItem("prevOffset"));

        // List of previous restaurants
        const prevRestaurants = JSON.parse(
            window.localStorage.getItem("prevRestaurants")
        );

        console.log("prevOffset", prevOffset);
        console.log("prevRestaurants", prevRestaurants);

        this.state = {
            offset:
                isNaN(prevOffset) || prevOffset > RESTAURANT_RESET ? 0 : prevOffset,
            limit: LIMIT,
            restaurants: [],
            fetching: false,
            prevRestaurants: prevRestaurants || []
        };

        console.log("offset", this.state.offset);
    }

    // Gets geolocation info
    getLocation = () => {
        // Checks if geolocation feature exists in browser
        if (navigator.geolocation) {
            // Sets message state for getting geolocation
            this.setState(
                {
                    message: "Getting geolocation info..."
                },
                () => {
                    // Gets gps info
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            console.log(position.coords.latitude, position.coords.longitude)
                            // Sets geolocation state
                            this.setState(prevState => {
                                    // Gets previous gps coordinates from local storage
                                    const prevCoords = JSON.parse(window.localStorage.getItem("prevCoords"));

                                    let offset = prevState.offset; 
                                    let restaurants = prevState.restaurants;
        
                                    // Checks if previous gps location is different than 
                                    // current gps location by magnitude of ~1km
                                    // Resets offset and restaurants list if true,
                                    // otherwise we can reuse previous session's already fetched info
                                    if (prevCoords && (Math.abs(position.coords.latitude - prevCoords.latitude) > 0.01 || 
                                        Math.abs(position.coords.longitude - prevCoords.longitude) > 0.01)) {
                                            offset = 0;
                                            restaurants = [];
                                        }

                                    return {
                                        coords: {
                                            latitude: position.coords.latitude,
                                            longitude: position.coords.longitude
                                        },
                                        message: "Getting restaurant information...",
                                        offset: offset,
                                        restaurants: restaurants
                                    }
                                },
                                () => {
                                    // Stores current coordinates in localStorage for next session
                                    window.localStorage.setItem(
                                        "prevCoords",
                                        JSON.stringify(this.state.coords)
                                    );
                                    // Loads restaurants into app
                                    this.fetchRestaurants(true)
                                        .then(() => {
                                            // Displays next restaurants after restaurants are done loading
                                            this.getNextRestaurant();
                                        })
                                        .catch(err => {
                                            console.log(
                                                "fetchRestaurants " + err
                                            );
                                        });
                                }
                            );
                        },
                        error => {
                            let message;

                            // Geolocation get errors
                            switch (error.code) {
                                case error.PERMISSION_DENIED:
                                    message =
                                        "User denied the request for Geolocation.";
                                    break;
                                case error.POSITION_UNAVAILABLE:
                                    message =
                                        "Location information is unavailable.";
                                    break;
                                case error.TIMEOUT:
                                    message =
                                        "The request to get user location timed out.";
                                    break;
                                case error.UNKNOWN_ERROR:
                                    message = "An unknown error occurred.";
                                    break;
                                default:
                                    break;
                            }

                            this.setState({
                                message: message
                            });
                        }
                    );
                }
            );
        } else {
            this.setState({
                message: "Geolocation is not supported by this browser."
            });
        }
    };

    // Makes API call to backend to fetch restaurants in bulk
    fetchRestaurants = firstLoad => {
        return new Promise((resolve, reject) => {
            axios
                .get(
                    BASE_SERVER_URL +
                        `/api/restaurants?latitude=${
                            this.state.coords.latitude
                        }` +
                        `&longitude=${this.state.coords.longitude}` +
                        `&offset=${this.state.offset}` +
                        `&limit=${this.state.limit}`
                )
                .then(res => {
                    this.setState(
                        prevState => {
                            // Sets previous offset in local storage
                            window.localStorage.setItem(
                                "prevOffset",
                                prevState.offset
                            );

                            let restaurants;
                            let prevRestaurants = prevState.prevRestaurants;

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
                                restaurants: restaurants.concat(
                                    prevState.restaurants
                                ),
                                message: null,
                                fetching: false,
                                offset: prevState.offset + prevState.limit,
                                prevRestaurants: prevRestaurants
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
        if (
            !this.state.message &&
            this.state.restaurants.length <=
                Math.round(this.state.limit * 0.2) &&
            !this.state.fetching
        ) {
            // If number of restaurants in state are less than 20% of limit,
            // then more restaurants are loaded into the state
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
            let randomNumber = this.getRandomNumber(
                this.state.restaurants.length
            );
            let restaurant = this.state.restaurants[randomNumber];

            let prevRestaurants = this.state.prevRestaurants;
            prevRestaurants.push(restaurant.id);

            // Updates previous restaurants in local storage
            window.localStorage.setItem(
                "prevRestaurants",
                JSON.stringify(prevRestaurants)
            );

            this.setState(
                prevState => ({
                    restaurant: {
                        name: restaurant.name,
                        rating: restaurant.rating,
                        location: restaurant.location.address1
                    },
                    // Filters out current restaurant from potential restaurants
                    restaurants: prevState.restaurants.filter(
                        (_, i) => i !== randomNumber
                    ),
                    message: null,
                    prevRestaurants: prevRestaurants
                }),
                () => {
                    console.log(this.state.restaurants);
                }
            );
        }
    };

    // Random number generator
    getRandomNumber = max => {
        return Math.floor(Math.random() * max);
    };

    render() {
        // Initial state
        if (!this.state.message && !this.state.coords) {
            return (
                <div className="App">
                    <Button
                        id="show-restaurants"
                        onClick={this.getLocation}
                        variant="contained"
                        color="primary"
                    >
                        Show nearby restaurants{" "}
                    </Button>{" "}
                </div>
            );
        // State where there is a restaurant loaded
        } else if (!this.state.message && this.state.restaurant) {
            return (
                <div className="App">
                    <h2> {this.state.restaurant.name} </h2>{" "}
                    <h2> {this.state.restaurant.rating} </h2>{" "}
                    <h2> {this.state.restaurant.location} </h2>{" "}
                    <Button
                        onClick={this.getNextRestaurant}
                        variant="contained"
                        color="primary"
                    >
                        Shuffle{" "}
                    </Button>{" "}
                </div>
            );
        // Message state
        } else {
            return (
                <div className="App">
                    <h2 id="message"> {this.state.message} </h2>{" "}
                </div>
            );
        }
    }
}

export default App;
