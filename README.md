# imagemapper

Imagemapper is a small extension for the Chrome webbrowser. It is available in the Chrome Web Store. The only thing it does is highlighting image maps and their active areas.

## Installation

From the Chrome Web Store: https://chrome.google.com/webstore/detail/image-mapper/aebmclcgniafplinakjjcieeajecjhal

## Usage

When you visit a website which contains html image maps, a small icon will appear in your address bar. Click it to highlight the image maps on that page and their active areas. Click again to remove highlights.

## About html image maps

* http://www.w3.org/TR/html/embedded-content-0.html#the-map-element
* http://www.w3.org/TR/html/embedded-content-0.html#the-area-element
* http://www.w3.org/TR/html/embedded-content-0.html#image-map

## About highlights

* the map itself is highlighted using a red overlay and yellow quarter-cirlces in the corners
* rect areas are red
* circle areas are green
* poly areas are blue

## Known issues

* Highlights are not updated when the dimensions of the image map change. You need to remove the highlights and add them again.

## Example pages

* https://en.wikipedia.org/wiki/Image_map
* https://de.wikipedia.org/wiki/Verweissensitive_Grafik

## Technical information

Painting is done using [SVG](http://www.w3.org/TR/SVG/)

## Contributing

Please send pull requests!

## License

Copyright: 2015 Benjamin Bock

License: Apache 2.0
