<p align="center">
![alt text](https://i.imgur.com/owrQCO9.png "CerusJS")<br>
<p align="center">[NPM](https://www.npmjs.com/~cerusjs) | [Github](https://github.com/cerusjs) | [Docs](https://cerusjs.github.io/)</p>
</p>

CerusJS is a modular, and even more important, understandable NodeJS framework. It is built to be as lightweight as you want it to be. Pick what you want to use to maximize performance or just be free of bloat. On top of that, CerusJS is also created to be easy to learn and easy to master. All names are styled similarly to make everything intuitive to use. This module is used as "hub", containing all the basic modules you'll need to create a basic webserver.


## Installation
CerusJS is available through [NPM](https://www.npmjs.com). Make sure you have [NodeJS](https://nodejs.org/en/download/) installed when installing and using CerusJS.
```bash
# Installs the latest version of CerusJS.
$ npm install cerus
```


## Modules
Install the modules you want to shape CerusJS how you want it to be. A few example modules are:
- The [cerus-server](https://github.com/cerusjs/cerus-server) module contains all the server related functions.
- With [cerus-router](https://github.com/cerusjs/cerus-router) you can route requests based on their URL.
- The [cerus-api](https://github.com/cerusjs/cerus-api) module is used for routing REST requests.
- The [cerus-promise](https://github.com/cerusjs/cerus-promise) module is a custom promise.
- With [cerus-fs](https://github.com/cerusjs/cerus-fs) you can write to, read from and monitor files and directories.


## Creating a server
To create a basic server you only have to use the following code.
```javascript
var cerus = require("cerus")();
cerus.server().start();
```


## Documentation
The documentation for all official modules can be found [here](https://cerusjs.github.io/). 


## Contributers
The author of CerusJS is [JortvD](https://github.com/JortvD).