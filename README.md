# \<kwc-color-wheel\>

A color wheel with magnifier

 - What is it called?
     - kwc-color-wheel
 - What is it made out of?
     - A wheel showing a range of colors and a magnifier appearing on touch/mouse over
 - What variants are needed?
     - None
 - How does it scale?
     - Desktop: Uses mouse events ( magnifier on hover, value on click )
     - Mobile/Touch: Uses touch events ( magnifier on touchstart, value on touchend )
 - What style variables are in use?
     - Maginifier: Can style the border of the magnifier
     - Size: Can change the size of the wheel

## Installation
Clone this repository.
Run `bower i`

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test --skip-plugin junit-reporter
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
