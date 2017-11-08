import { define, Component } from '@xinix/xin';

export class MapGoogleMarker extends Component {
  get props () {
    return Object.assign({}, super.props, {
      latitude: {
        type: Number,
        value: -6.254844,
        observer: '_positionChanged(latitude, longitude)',
      },

      longitude: {
        type: Number,
        value: 106.826583,
        observer: '_positionChanged(latitude, longitude)',
      },

      map: {
        type: Object,
        observer: '_mapChanged',
      },

      marker: {
        type: Object,
      },

      info: {
        type: Object,
      },

      title: {
        type: String,
      },

      label: {
        type: String,
      },

      icon: {
        type: String,
      },

      mouseEvents: {
        type: Boolean,
        observer: '_mouseEventsChanged',
      },
    });
  }

  created () {
    super.created();
    this._listeners = {};
  }

  _mapChanged (map) {
    this.set('marker', new window.google.maps.Marker({
      position: { lat: Number(this.latitude), lng: Number(this.longitude) },
      map: map,
      title: this.title,
      label: this.label,
      icon: this.icon,
    }));

    this._mouseEventsChanged();
  }

  _clearListener (name) {
    if (this._listeners[name]) {
      this.marker.removeListener(this._listeners[name]);
      this._listeners[name] = null;
    }
  }

  _forwardEvent (name) {
    if (this._listeners[name]) return;

    this._listeners[name] = this.marker.addListener(name, (evt) => {
      this.fire(name, evt);
    });
  }

  _mouseEventsChanged () {
    if (this.marker) {
      if (this.mouseEvents) {
        this._forwardEvent('click');
      } else {
        this._clearListener('click');
      }
    }
  }

  _positionChanged (latitude, longitude) {
    if (!this.marker) {
      return;
    }

    this.debounce('_positionChanged', () => {
      this.marker.setPosition({ lat: latitude, lng: longitude });
    });
  }

  openInfo (content) {
    if (!this.info) {
      this.set('info', new window.google.maps.InfoWindow({
        content: content,
      }));
    } else {
      this.info.setContent(content);
    }

    this.info.open(this.map, this.marker);
  }

  closeInfo () {
    if (this.info) {
      this.info.close();
    }
  }
}

define('map-google-marker', MapGoogleMarker);
