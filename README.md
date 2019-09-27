# Personal Post Highlighter for Tumblr

<img src="resources/example.gif">

## What is this?

This is a tiny chrome extension that highlights a blog's personally uploaded content. Tumblr has historically failed to provide this functionality to end users, leaving many to resort to third party alternatives. [Click here to add to chrome](https://chrome.google.com/webstore/detail/tumblr-personal-post-high/lcfdkkodbhjgooidmbbofnafakdjnblk).

This application is the successor to the now outdated [tumblr-scraper](https://github.com/lluisrojass/tumblr-scraper). 

## Usage

Just add the extension to your chrome browser and uploaded posts will now sport a green checkmark indicator. To silence/turn off the application for an individual blog simply click on the green application icon. The application will remember this decision and remain hidden until you decide to toggle it back on for a respective archive. 

## Commands

`$ make build`

Builds all extension scripts to an isolated directory & copies over relevant ext. files. Run this command to create a production ready package. Aliased to `make`.  

Individual packages can also be built via the `build.content` & `build.background` commands.

`$ make watch.content` | `$ make watch.background`

Packages a development build of the respective extension packages, runs a watch on package specific source files.

`$ make test`

Tests all portions of the extension. Testing done with [Jest](https://github.com/facebook/jest)

`$ make clean` 

clean workspace, removes test/dist/watch specific directories & files.

## Licence 

MIT