# Adventure Kit

Adventure Kit will be a toolkit for creating your own old-school role-playing games. Right now, I have a basic pixel art editor, and a music composition demo in place. Coming soon: a map editor, and a scripting interface, along with a way to actually run and play your game.

## Running the server

Install the app's dependencies with NPM:

`$ npm i`

If you don't already have `gulp` installed, install it with the following command:

`$ npm i -g gulp`

Then you can run `gulp` in the project's root directory, and it'll build the app and spin up a server.

## Reading the code

The bulk of the code lives under `public/js`. I used the Flux architecture here, but it was before I heard about Redux, so I used alt.js instead. The `components` directory in `public/js` contains most of the running code, whereas the `stores` directory holds the state management code, and the `actions` directory defines the actions that modify that state. If you're familiar with the Flux architecture, it should be pretty easy to jump in. If not, please contact me and let me know.

The top-level, "smart" components follow the `*_ctrl.js` naming pattern. You'll see `MusicCtrl`, `DrawCtrl`, etc. -- those are good places to start reading. From there, you can get into the lower-level, "dumb" (i.e. stateless) components that the smart components depend on.

## Comments

The design, the UI/UX of the app, leaves a lot to be desired. I'll eventually revamp the entire look and feel of the site, make it look decent, when I have time.

There are a lot of things I'd do differently, as I look over the code. For starters, I'd make better use of ES6 features like arrow functions to preserve the value of `this`, and to embed logic right in the JSX template, rather than composing it piecemeal.

I also have to come up with a data structure to store the musical data, now that I think about where I left off. I have to implement drag-and-drop on the tracks, too, so people can copy-paste their favorite riffs into a permanent track.

The hardest part of this project is going to be the actual engine, and the scripting environment around it. To start, I think I'll make a simple 2D, move-the-character-around engine, and make a simple scripting environment that hooks into the engine and configures a small part of it.

I know this project is likely to take years to complete, but it's something I've always wanted, since I started learning to code. One day... :)

## License

This code is licensed under the MIT license.

Copyright (c) 2016 Austin Pocus

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
