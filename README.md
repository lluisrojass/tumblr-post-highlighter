# Personal Post Highlighter for Tumblr

<img src="resources/example.gif">

## What is this?

This is a tiny chrome extension that highlights a blog's personally uploaded content. Tumblr has historically failed to provide this functionality to end users, leaving many to resort to third party alternatives. [Click here to add to chrome](https://chrome.google.com/webstore/detail/tumblr-personal-post-high/lcfdkkodbhjgooidmbbofnafakdjnblk).

This application is the successor to the now outdated [tumblr-scraper](https://github.com/lluisrojass/tumblr-scraper). 

## Usage

Just add the extension to your chrome browser and uploaded posts will now sport a green indicator. To toggle highlighting for a blog, click the green application icon. The extension will remember this decision and remain hidden until it is toggled back on. 

## Commands

This project uses [GNU make](https://www.gnu.org/software/make/) to manage/describe scripts.  

`$ gmake build`

Creates a production ready application bundle.

Individual packages can also be built via the `build.content` & `build.background` commands.

`$ gmake watch.content` | `$ gmake watch.background`

Creates a development bundle, runs watch on relevant source files.

`$ gmake test`

Executes unit tests. Testing done via [Jest](https://github.com/facebook/jest)

`$ gmake clean` 

Cleans all generated files/directories. 

## Licence 

MIT
