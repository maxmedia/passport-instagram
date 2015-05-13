/**
 * Module dependencies.
 */
var Strategy = require('./strategy');


/**
 * Framework version.
 */
require('pkginfo')(module, 'version');

/**
 * Expose constructors.
 */
exports.Strategy = Strategy;

/**
 * Signature generator
 */
exports.signature = require('./signature');
