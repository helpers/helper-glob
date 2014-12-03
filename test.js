/*!
 * helper-glob <https://github.com/jonschlinkert/helper-glob>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var handlebars = require('handlebars');
var _ = require('lodash');
var glob = require('./');

describe('sync', function () {
  it('should return the contents of a file:', function () {
    glob.sync('fixtures/a.txt').should.eql([ { content: 'AAA', path: 'fixtures/a.txt' } ]);
  });

  it('should return the contents of a glob of files:', function () {
    glob.sync('fixtures/*.txt').should.eql([
      { content: 'AAA', path: 'fixtures/a.txt' },
      { content: 'BBB', path: 'fixtures/b.txt' },
      { content: 'CCC', path: 'fixtures/c.txt' }
    ]);
  });
});

describe('handlebars:', function () {
  it('should work as a handlebars helper in `object` mode:', function () {
    function read(patterns, options) {
      options.mode = 'string';
      return glob.sync(patterns, options);
    }
    handlebars.registerHelper('glob', helper);
    handlebars.compile('{{glob "fixtures/*.txt"}}')().should.equal('AAA,BBB,CCC');
  });

  it('should work as a handlebars helper in `string` mode:', function () {
    function helper(patterns, options) {
      options.mode = 'string';
      return glob.sync(patterns, options);
    }
    handlebars.registerHelper('glob', helper);
    handlebars.compile('{{glob "fixtures/*.txt"}}')().should.equal('AAA,BBB,CCC');
  });
});


describe('async', function () {
  it('should return the contents of a file:', function (done) {
    glob('fixtures/a.txt', function (err, res) {
      res.should.eql([{path: 'fixtures/a.txt', content: 'AAA'}]);
      done();
    });
  });

  it('should return the contents of a glob of files:', function (done) {
    glob('fixtures/*.txt', function (err, res) {
      res.should.eql([
        {path: 'fixtures/a.txt', content: 'AAA'},
        {path: 'fixtures/b.txt', content: 'BBB'},
        {path: 'fixtures/c.txt', content: 'CCC'}
      ]);
    });
      done();
  });
});


// describe('lodash:', function () {
//   it('should work as a lodash mixin:', function () {
//     _.mixin({glob: glob});
//     _.template('<%= _.glob("fixtures/*.txt") %>', {}).should.equal(['AAA', 'BBB', 'CCC']);
//   });

//   it('should work when passed to lodash on the context:', function () {
//     var settings = {imports: {glob: glob}};
//     _.template('<%= glob("fixtures/*.txt") %>', {glob: glob}).should.equal(['AAA', 'BBB', 'CCC']);
//   });

//   it('should work as a lodash import:', function () {
//     var settings = {imports: {glob: glob}};
//     _.template('<%= glob("fixtures/*.txt") %>', {}, settings).should.equal(['AAA', 'BBB', 'CCC']);
//   });
// });