/**
`kwc-color-wheel`

A color wheel with magnifier

Custom property | Description | Default
----------------|-------------|----------
`--kwc-color-wheel-magn-border` | border applied to the magnifier | `1px solid black`

@group Kano Web Components
@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/paper-styles/shadow.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
             :host {
                display: block;
                position: relative;
                border-radius: 3px;
            }

            #canvas {
                border-radius: 50%;
                margin: 20px 25px;
                cursor: pointer;
            }

            .magn {
                position: absolute;
                opacity: 0;
                transform: scale(0);
                width: 100px;
                height: 100px;
                border-radius: 50%;
                pointer-events: none;
                transition: transform cubic-bezier(0.2, 0, 0.13, 1.5) 150ms, opacity cubic-bezier(0.2, 0, 0.13, 1.5) 150ms;
                transform-origin: 50% 110%;
                @apply --shadow-elevation-2dp;
                border: var(--kwc-color-wheel-magn-border, 1px solid black);
            }

            .magn.open {
                opacity: 1;
                transform: scale(1);
            }
        </style>
        <canvas id="canvas"></canvas>
        <div id="magn" class="magn"></div>
`,

  is: 'kwc-color-wheel',

  properties: {
      value: {
          type: String,
          notify: true
      },
      renderLater: {
          type: Boolean,
          value: false
      },
      size: {
          type: Number,
          value: 170
      }
  },

  attached() {
      this._onClick = this._onClick.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onMouseOut = this._onMouseOut.bind(this);
      this._onMouseOver = this._onMouseOver.bind(this);
      this._onTouchEnd = this._onTouchEnd.bind(this);
      this.$.canvas.addEventListener('mousedown', this._onClick);
      this.$.canvas.addEventListener('touchend', this._onTouchEnd);
      this.$.canvas.addEventListener('mousemove', this._onMouseMove);
      this.$.canvas.addEventListener('touchmove', this._onMouseMove);
      this.$.canvas.addEventListener('mouseout', this._onMouseOut);
      this.$.canvas.addEventListener('mouseover', this._onMouseOver);
      this.$.canvas.addEventListener('touchstart', this._onMouseOver);
      if (!this.renderLater) {
          this.render();
      }
  },

  detached() {
      this.$.canvas.removeEventListener('mousedown', this._onClick);
      this.$.canvas.removeEventListener('touchend', this._onTouchEnd);
      this.$.canvas.removeEventListener('mousemove', this._onMouseMove);
      this.$.canvas.removeEventListener('touchmove', this._onMouseMove);
      this.$.canvas.removeEventListener('mouseout', this._onMouseOut);
      this.$.canvas.removeEventListener('mouseover', this._onMouseOver);
      this.$.canvas.removeEventListener('touchstart', this._onMouseOver);
  },

  _onClick() {
      this.set('value', this.magnColor);
  },

  _onTouchEnd () {
      this._onClick();
      this._onMouseOut();
  },

  _onMouseOut() {
      this._isMouseOver = false;
      this.toggleClass('open', false, this.$.magn);
  },

  _onMouseOver(e) {
      this._isMouseOver = true;
      this.toggleClass('open', true, this.$.magn);
      this._onMouseMove(e);
  },

  /*
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255]. 
   */
  hslToRgb(h, s, l) {
      let r, g, b;
      if (s == 0) {
          r = g = b = l; // achromatic
      } else {
          let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          let p = 2 * l - q;
          r = this.hue2rgb(p, q, h + 1 / 3);
          g = this.hue2rgb(p, q, h);
          b = this.hue2rgb(p, q, h - 1 / 3);
      }
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  },

  hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
  },

  componentToHex(c) {
      let hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
  },

  rgbToHex(r, g, b) {
      return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  },

  _onMouseMove(e) {
      if (this._isMouseOver) {
          let pos;
          if (e.touches) {
              pos = {
                  x: e.touches[0].clientX,
                  y: e.touches[0].clientY
              };
              e.preventDefault();
              e.stopPropagation();
          } else {
              pos = { x: e.x, y: e.y };
          }
          this.wheelRect = this.$.canvas.getBoundingClientRect();
          let x = pos.x - this.wheelRect.left,
              y = pos.y - this.wheelRect.top,
              r = (this.size - 2) / 2,
              dist = Math.sqrt(Math.pow(r - x, 2) + Math.pow(r - y, 2)),
              a = (Math.PI * 3 / 2) - Math.atan2(r - y, r - x),
              h, s, l, rgbValue;
          h = a * 180 / Math.PI;
          s = 100 - (dist * 2 / r);
          l = 105 - (dist * 95 / r);
          h = h % 360;
          h /= 360;
          s /= 100;
          l /= 100;
          rgbValue = this.rgbToHex.apply(this, this.hslToRgb(h, s, l));
          this.set('magnColor', rgbValue);
          this.$.magn.style.top = `${y - 90}px`;
          this.$.magn.style.left = `${x - 25}px`;
          this.$.magn.style.background = rgbValue;
      }
  },

  render() {
      this._drawWheel(this.$.canvas, this.size);
  },

  _drawWheel(canvas, size) {
      let r = (size - 2) / 2,
          ctx;
      canvas.setAttribute('width', size);
      canvas.setAttribute('height', size);
      ctx = canvas.getContext('2d');
      for (let i = 0; i < r + 1; i++) {
          // A ring
          let c = 5 * Math.PI * i;
          for (let j = 0; j < c; j++) {
              let a = j * 3 * Math.PI / c,
                  y = Math.cos(a) * i,
                  x = Math.sin(a) * i;
              ctx.fillStyle = `hsl(${a * 180 / Math.PI}, ${100 - (i * 2 / r)}%, ${105 - i * 95 / r}%)`;
              ctx.fillRect(r + x, r + y, 2, 2);
          }
      }
  }
});
