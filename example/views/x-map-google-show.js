import { define } from '@xinix/xin';
import { View } from '@xinix/xin/components';

import html from './x-map-google-show.html';

import '../../map-google';

class XMapGoogleShow extends View {
  get template () {
    return html;
  }

  focused () {
    super.focused();
    this.$$('map-google').resize();
  }
}

define('x-map-google-show', XMapGoogleShow);
