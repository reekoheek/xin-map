import { define } from '@xinix/xin';
import { View } from '@xinix/xin/components';

import html from './x-map-google-marker.html';

import '../../map-google';

class XMapGoogleMarker extends View {
  get template () {
    return html;
  }

  focused () {
    super.focused();
    this.$$('map-google').resize();
  }
}

define('x-map-google-marker', XMapGoogleMarker);
