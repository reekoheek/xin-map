import { define } from '@xinix/xin';
import { App } from '@xinix/xin/components';

import html from './x-app.html';

import '../views/x-map-google-show';
import '../views/x-map-google-marker';
import '../../map-google-view';

class XApp extends App {
  get template () {
    return html;
  }

  get props () {
    return Object.assign({}, super.props, {
      apiKey: {
        type: String,
        value: '',
      },
    });
  }

  attached () {
    super.attached();

    this.set('apiKey', window.localStorage['xin-map-google-api-key']);
  }

  saveApiKey (evt) {
    evt.preventDefault();

    window.localStorage['xin-map-google-api-key'] = this.apiKey;

    alert('Saved');
  }
}

define('x-app', XApp);
