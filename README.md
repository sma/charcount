CHARCOUNT
=========

A tiny single page application to count the characters in a text area.

To setup

	$ npm install
	$ npm start

The first line will install all dependencies (see `packages.json`).
The second line will then use the provided `gulpfile.js` to start
watching all TypeScript source files to compile them to JavaScript
(see `tsconfig.json` for details)  as well as watching all html and 
css files for changes to automatically reload the displayed web page 
in the default browser.
