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

var path = require('path');
var globby = require('globby');
var extend = require('extend-shallow');


/**
 * Expose `glob` helpers
 */

module.exports = glob;

/**
 * Return the content from a glob of files
 * using glob patterns.
 *
 * @param {String} `patterns`
 * @param {Options} `opts`
 * @return {Object}
 * @api public
 */

function glob(patterns, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts; opts = {};
  }
  opts = extend({}, typeof patterns === 'object' ? patterns : {}, opts);
  if (this && this.app) {
    opts = extend({}, this.context, this.app.options, opts);
  }
  if (opts && opts.hash) {
    extend(opts, opts.hash);
  }
  globby(patterns, opts, function(err, files) {
    if (err) return cb(err);
    cb(null, files.map(cwd(opts)));
  });
}

/**
 * Return the content from a glob of files
 * using glob patterns.
 *
 * @param {String} `patterns`
 * @param {Options} `opts`
 * @return {String}
 */

glob.sync = function(patterns, opts) {
  opts = extend({}, typeof patterns === 'object' ? patterns : {}, opts);
  if (this && this.app) {
    opts = extend({}, this.context, this.app.options, opts);
  }
  if (opts && opts.hash) {
    extend(opts, opts.hash);
  }
  return globby.sync(patterns, opts).map(cwd(opts));
};

/**
 * Make file paths relative to process.cwd()
 */

function cwd(opts) {
  return function (fp) {
    if (!opts.cwd) return fp;
    return path.join(opts.cwd, fp)
      .replace(/\\/g, '/');
  };
}