import { define } from '@xinix/xin';
import { View } from '@xinix/xin/components/view';

import html from './templates/map-google-view.html';

import './map-google';
import './map-google-marker';
import './css/map-google-view.css';

export class MapGoogleView extends View {
  get template () {
    return html;
  }

  get props () {
    return Object.assign({}, super.props, {
      title: {
        type: String,
        value: 'Choose Map',
      },

      latitude: {
        type: Number,
        observer: '_locationChanged(latitude, longitude)',
      },

      longitude: {
        type: Number,
        observer: '_locationChanged(latitude, longitude)',
      },

      apiKey: {
        type: String,
      },

      value: {
        type: Object,
        value: () => ({}),
      },

      search: {
        type: String,
        value: '',
      },

      callback: {
        type: Function,
        value: () => {
          return result => {
            console.info('Choose callback do nothing');
          };
        },
      },
    });
  }

  ready () {
    super.ready();

    this.classList.add('map-google-view');
  }

  focusing (parameters) {
    super.focusing(parameters);

    if (parameters.latitude && parameters.longitude) {
      this.set('latitude', Number(parameters.latitude));
      this.set('longitude', Number(parameters.longitude));
    } else {
      navigator.geolocation.getCurrentPosition(position => {
        // if (this.latitude || this.longitude) {
        //   return;
        // }

        this.set('latitude', position.coords.latitude);
        this.set('longitude', position.coords.longitude);
      });
    }
  }

  focused () {
    super.focused();
    this.$.map.resize();
  }

  _chooseClicked (evt) {
    evt.stopImmediatePropagation();

    if (this.isSet) {
      window.history.back();
      this.callback(this.value);
    }
  }

  _mapReady (evt) {
    let searchBox = new window.google.maps.places.SearchBox(this.$.search);
    searchBox.addListener('places_changed', () => {
      this.$.search.blur();

      let places = searchBox.getPlaces();
      if (places && places.length) {
        this.$.map.map.setCenter(places[0].geometry.location);
      }
    });
  }

  _locationChanged (latitude, longitude) {
    if (!window.google || !latitude || !longitude) {
      return;
    }

    this.isSet = false;

    this.debounce('_locationChanged', () => {
      let geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat: this.latitude, lng: this.longitude } }, (results, status) => {
        if (status !== window.google.maps.GeocoderStatus.OK) {
          return;
        }

        let val = {
          latitude: this.latitude,
          longitude: this.longitude,
          googleFormattedAddress: results[0].formatted_address,
          address: results[0].formatted_address,
          components: {},
        };

        results[0].address_components.forEach(component => {
          if (component.types[0] === 'political') {
            return;
          }
          val.components[component.types[0]] = component.long_name;
        });

        this.set('value', val);
        this.set('search', val.address);

        this.isSet = true;
      });
    });
  }
}

define('map-google-view', MapGoogleView);
