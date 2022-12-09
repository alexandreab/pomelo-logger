const util = require('util');
const levels = require('log4js').levels;
/**
 * Define JSON layout for event logging
 * @param {object} config config object for layout customization.
 * @param {string} config.separator string separator between event logs.
 * @param {string} config.callStackLevel minimum level string required to enable callStack logging.
 * @return {function(*)}
 * @constructor
 */
function jsonLayout(config) {
  return function (loggingEvent) {
    const eventLevel = levels.getLevel(loggingEvent.level);
    const logJson = {
      startTime: loggingEvent.startTime,
      categoryName: loggingEvent.categoryName,
      message: util.format(...loggingEvent.data),
      level: eventLevel.levelStr,
      context: loggingEvent.context,
      functionName: loggingEvent.functionName,
      fileName: loggingEvent.fileName,
      lineNumber: loggingEvent.lineNumber,
      columnNumber: loggingEvent.columnNumber,
    }
    if (config.callStackLevel && eventLevel.isGreaterThanOrEqualTo(config.callStackLevel)) {
        logJson.callStack = loggingEvent.callStack;
    }
    const separator = config.separator ? config.separator : '';
    return JSON.stringify(logJson) + separator;
  }
}

module.exports = jsonLayout;
