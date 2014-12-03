/*!
 * helper-glob <https://github.com/jonschlinkert/helper-glob>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var glob = require('globby');
var async = require('async');
var extend = require('extend-shallow');


/**
 * Return the content from a glob of files
 * using glob patterns.
 *
 * ```handlebars
 * {{glob 'files/*.md'}}
 * ```
 * @param {String} `patterns`
 * @param {Options} `opts`
 * @return {Object}
 */

module.exports = function(patterns, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  opts = extend({}, {mode: 'object'}, opts);

  glob(patterns, opts, function(err, files) {
    if (err) return cb(err);
    cb(null, files);
  });
};


/**
 * Return the content from a glob of files
 * using glob patterns.
 *
 * ```handlebars
 * {{glob 'files/*.md'}}
 * ```
 * @param {String} `patterns`
 * @param {Options} `opts`
 * @return {String}
 */

module.exports.sync = function(patterns, opts) {
  return glob.sync(patterns, opts);
};