import React from 'react';
import { mount, shallow } from 'enzyme';
import App from '../components/App';

test('renders without crashing', () => {
  const component = shallow(<App />);

  expect(component).toMatchSnapshot();
});

test('should catch if the browser does not support geolocation', () => {
  global.navigator.geolocation = undefined;

  const component = shallow(<App />);

  const showRestaurantsButton = component.find('#show-restaurants');
  showRestaurantsButton.simulate('click');

  const message = component
    .find('h2#message')
    .text()
    .trim();

  expect(message).toEqual('Geolocation is not supported by this browser.');
});

describe('fetch restaurant for first time ever', () => {
  beforeAll(() => {
    const geolocationMock = {
      getCurrentPosition: jest.fn(success => {
        setTimeout(
          Promise.resolve(
            success({
              coords: {
                latitude: 43.7888386,
                longitude: -79.4375602
              }
            })
          ),
          5000
        );
      })
    };

    global.navigator.geolocation = geolocationMock;
  });

  it('should display getting geolocation info message', async () => {
    global.navigator.geolocation.getCurrentPosition = success => {
      setTimeout(() => {
        Promise.resolve(
          success({
            coords: {
              latitude: 43.7888386,
              longitude: -79.4375602
            }
          })
        );
      }, 2000);
    };

    const component = mount(<App />);

    const showRestaurantsButton = component.find('WithStyles(Button)#show-restaurants');
    showRestaurantsButton.simulate('click');

    const message = await component
      .find('h2#message')
      .text()
      .trim();

    expect(message).toEqual('Getting geolocation info...');

    component.unmount();
  });
});
