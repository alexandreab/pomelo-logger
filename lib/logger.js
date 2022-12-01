const log4js = require('log4js');
const fs = require('fs');
const util = require('util');
const jsonLayout = require('./jsonLayout');


const funcs = {
	'env': doEnv,
	'args': doArgs,
	'opts': doOpts
};

/**
 * Configure the logger.
 * Configure file just like log4js.json. And support ${scope:arg-name} format property setting.
 * It can replace the placeholder in runtime.
 * scope can be:
 *     env: environment variables, such as: env:PATH
 *     args: command line arguments, such as: args:1
 *     opts: key/value from opts argument of configure function
 *
 * @param  {String|Object} config configure file name or configure object
 * @param  {number} config.reloadSecs reload logger configuration file every given time
 * @param  {Object} opts   options
 * @return {void}
 */

function configure(config, opts) {
	config = config || process.env.LOG4JS_CONFIG;
	opts = opts || {};

	if (typeof config === 'string') {
		config = JSON.parse(fs.readFileSync(config, "utf8"));
	}

	if (config) {
		config = replaceProperties(config, opts);
	}

	// add JSON layout support to log4js
	log4js.addLayout('json', jsonLayout);

	// config object could not turn on the auto reload configure file in log4js

	log4js.configure(config, opts);
}

function replaceProperties(configObj, opts) {
	if (configObj instanceof Array) {
		let i = 0, l = configObj.length;
		for (; i < l; i++) {
			configObj[i] = replaceProperties(configObj[i], opts);
		}
	} else if (typeof configObj === 'object') {
		let field;
		for (const f in configObj) {
			if (!configObj.hasOwnProperty(f)) {
				continue;
			}

			field = configObj[f];
			if (typeof field === 'string') {
				configObj[f] = doReplace(field, opts);
			} else if (typeof field === 'object') {
				configObj[f] = replaceProperties(field, opts);
			}
		}
	}

	return configObj;
}

function doReplace(src, opts) {
	if (!src) {
		return src;
	}

	const ptn = /\$\{(.*?)\}/g;
	let m, pro, ts, scope, name, defaultValue, func, res = '',
		lastIndex = 0;
	while ((m = ptn.exec(src))) {
		pro = m[1];
		ts = pro.split(':');
		if (ts.length !== 2 && ts.length !== 3) {
			res += pro;
			continue;
		}

		scope = ts[0];
		name = ts[1];
		if (ts.length === 3) {
			defaultValue = ts[2];
		}

		func = funcs[scope];
		if (!func && typeof func !== 'function') {
			res += pro;
			continue;
		}

		res += src.substring(lastIndex, m.index);
		lastIndex = ptn.lastIndex;
		res += (func(name, opts) || defaultValue);
	}

	if (lastIndex < src.length) {
		res += src.substring(lastIndex);
	}

	return res;
}

function doEnv(name) {
	return process.env[name];
}

function doArgs(name) {
	return process.argv[name];
}

function doOpts(name, opts) {
	return opts ? opts[name] : undefined;
}

module.exports = {
	getLogger: log4js.getLogger,

	addLayout: log4js.addLayout,
	configure: configure,

	levels: log4js.levels,
};
