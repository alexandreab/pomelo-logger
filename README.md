pomelo-logger
========

pomelo-logger is a [log4js](https://github.com/nomiddlename/log4js-node) wrapper for [pomelo](https://github.com/NetEase/pomelo) which provides some useful features.  

## Installation
```
npm install pomelo-logger
```

## Features
You can configure multiple log layouts available through the log4js features. The example below contains some of the different appenders that can be used (official documentation and more examples [here](https://log4js-node.github.io/log4js-node/layouts.html)).

> Note that some log info (as `lineNumber` and `callStack`) are only available with the flag `enableCallStack` enabled (see [log4js api doc](https://log4js-node.github.io/log4js-node/api.html)).

```json
{
  "appenders": {
    "jsonFile": {
      "type": "file",
      "filename": "json-logs.log",
      "layout": { "type": "json", "separator": ",", "callStackLevel": "info" }
    },
    "jsonConsole": {
      "type": "stdout",
      "layout": { "type": "json", "separator": ",", "callStackLevel": "error" }
    },
    "consolePattern": {
      "type": "stdout",
      "layout": { "type": "pattern", "pattern": "%d %p %c %m%n" }
    },
    "basic": { "type": "stdout", "layout": { "type": "basic" } },
    "colored": { "type": "stdout", "layout": { "type": "colored" } }
  },
  "categories": {
    "analytics-debug": {
      "appenders": ["out"],
      "level": "debug"
    },
    "pomelo": {
      "appenders": ["jsonConsole"],
      "level": "info",
      "enableCallStack": true
    },
    "metagame": {
      "appenders": ["out", "jsonFile"],
      "level": "info",
      "enableCallStack": true
    },
    "externalProc": {
      "appenders": ["out"],
      "level": "debug"
    },
    "default": {
      "appenders": ["out"],
      "level": "debug"
    }
  }
}

```

## License
(The MIT License)

Copyright (c) 2012-2013 NetEase, Inc. and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
