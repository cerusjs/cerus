![alt text](https://i.imgur.com/owrQCO9.png "CerusJS")

CerusJS is a open, pluginable and free to use framework for NodeJS. Since everything is based around plugins, it can be as lightweight as you want it to be. This is a "hub" module. It contains all the basic modules and plugins you need to create a basic webserver.


## Installation
CerusJS is available through [NPM](https://www.npmjs.com). 
Before installing CerusJS make sure you have [NodeJS](https://nodejs.org/en/download/) installed.
```bash
# Installs the latest version of CerusJS.
$ npm install cerus
```


## Plugins & Modules
- The [cerus-server](https://github.com/cerusjs/cerus-server) module contains all the server related functions.
- With [cerus-router](https://github.com/cerusjs/cerus-router) you can route requests based on their URL.
- The [cerus-api](https://github.com/cerusjs/cerus-api) module is used for routing REST requests.
- With the [cerus-settings](https://github.com/cerusjs/cerus-settings) module you can easily create and use settings.
- The [cerus-promise](https://github.com/cerusjs/cerus-promise) module is a custom promise.
- Use [cerus-uuid](https://github.com/cerusjs/cerus-uuid) for working with UUIDs.
- The [cerus-compression](https://github.com/cerusjs/cerus-compression) module is a compression utility.
- With [cerus-fs](https://github.com/cerusjs/cerus-fs) you can write to, read from and monitor files and directories.
- Use [cerus-sessions](https://github.com/cerusjs/cerus-sessions) to control user-sessions.


## Creating a Server
To create a basic server you only have to use the following code.
```javascript
var cerus = require("cerus")();
cerus.server().start();
```


## Links
- [NPM](https://www.npmjs.com/~cerusjs)
- [Github](https://github.com/cerusjs)


## Contributers
The author of CerusJS is [JortvD](https://github.com/JortvD).