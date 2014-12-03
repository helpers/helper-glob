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
    async.map(files, function(fp, next) {
      fs.readFile(fp, 'utf8', function(err, content) {
        if (err) return cb(err);
        var res = {
          content: content,
          path: fp
        };
        if (opts.mode === 'string') res = content;
        next(null, res);
      });
    }, cb);
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
  opts = extend({}, {mode: 'object'}, opts);
  var files = glob.sync(patterns, opts);

  return files.map(function(fp) {
    var res = fs.readFileSync(fp, 'utf8');

    return opts.mode === 'object'
      ? {content: res, path: fp}
      : res;
  });
};