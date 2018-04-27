/*!
 * React Native Autolink
 *
 * Copyright 2016-2018 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
 */

import Autolinker from 'autolinker';

// To include a new country, find it's ISO Alpha 2 code at http://www.nationsonline.org/oneworld/country_code_list.htm
const regexByCountry = {
  US: /(\([0-9]{3}\)[\s-]|[0-9]{3}[\s-])[0-9]{3}[-\s][0-9]{4}/g, // matches (123) 123-1234, with or without the parentesis and dashes
  SE: /(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)?(0)\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?\d{5,6})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|#)\d{3,4})?/g,
  GB: /(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)?(44)\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?\d{5,6})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|#)\d{3,4})?/g,
  FR: /(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)?(33)\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?\d{5,6})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|#)\d{3,4})?/g,
  PT: /(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)?(351)\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?\d{5,6})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|#)\d{3,4})?/g,
  IE: /(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)?(353)\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?\d{5,6})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|#)\d{3,4})?/g,
  DE: /(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)?(49)\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?\d{5,6})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|#)\d{3,4})?/g,
};

/* eslint no-underscore-dangle: ["error", { "allow": ["_components"] }] */
RegExp.any = function RegExpAny() {
  let components = [];
  const args = [...arguments];

  args.map(arg => {
    if (arg instanceof RegExp) {
      components = components.concat(arg._components || arg.source);
    }
  });
  const combined = new RegExp(`(?:${components.join(')|(?:')})`,'g');
  combined._components = components;
  return combined;
};

const combinedRegex = (countryList = ['US']) => {
  const regexToInclude = [];
  Object.keys(regexByCountry).map(key => countryList.map((country) => {
    if (country === key) {
      return regexToInclude.push(regexByCountry[key]);
    }
  }));
  return RegExp.any(...regexToInclude);
};

export default [
  // LatLng
  {
    id: 'latlng',
    regex: /[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/g,
    Match: Autolinker.Util.extend(Autolinker.match.Match, {
      constructor(cfg) {
        Autolinker.match.Match.prototype.constructor.call(this, cfg);

        this.latlng = cfg.latlng;
      },
      getType() {
        return 'latlng';
      },
      getLatLng() {
        return this.latlng;
      },
      getAnchorHref() {
        return this.latlng;
      },
      getAnchorText() {
        return this.latlng;
      },
    }),
  },
  // Phone override
  {
    id: 'phone',
    regex: combinedRegex(['US', 'SE', 'GB', 'FR', 'PT', 'IE', 'DE']),
    Match: Autolinker.Util.extend(Autolinker.match.Match, {
      constructor(cfg) {
        Autolinker.match.Match.prototype.constructor.call(this, cfg);
        this.number = cfg.phone;
      },
      getType() {
        return 'phone';
      },
      getNumber() {
        return this.number;
      },
      getAnchorHref() {
        return `tel:${this.number}`;
      },
      getAnchorText() {
        return this.matchedText;
      },
    }),
  },
];

