/*!
 * helper-glob <https://github.com/jonschlinkert/helper-glob>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var fs = require('fs');
var should = require('should');
var handlebars = require('handlebars');
var _ = require('lodash');
var glob = require('./');

// passed as a `read` helper in tests
function read(fp) {
  return fs.readFileSync(fp, 'utf8');
}

// passed as a `readEach` helper in tests
function readEach(arr) {
  return arr.map(read);
}

describe('async', function () {
  it('should return the contents of a file:', function (done) {
    glob('fixtures/a.txt', function (err, res) {
      res.should.eql(['fixtures/a.txt']);
      done();
    });
  });

  it('should return the contents of a glob of files:', function (done) {
    glob('fixtures/*.txt', function (err, res) {
      res.should.eql(['fixtures/a.txt', 'fixtures/b.txt', 'fixtures/c.txt']);
      done();
    });
  });

  it('should pass options to globby:', function (done) {
    glob('*.txt', {cwd: 'fixtures'}, function (err, res) {
      res.should.eql(['fixtures/a.txt', 'fixtures/b.txt', 'fixtures/c.txt']);
      done();
    });
  });
});

describe('sync', function () {
  it('should return the contents of a file:', function () {
    glob.sync('fixtures/a.txt').should.eql(['fixtures/a.txt']);
  });

  it('should return the contents of a glob of files:', function () {
    glob.sync('fixtures/*.txt').should.eql(['fixtures/a.txt', 'fixtures/b.txt', 'fixtures/c.txt']);
  });
});

describe('handlebars:', function () {
  beforeEach(function () {
    handlebars.registerHelper('glob', glob.sync);
    handlebars.registerHelper('read', read);
  });

  it('should work as a handlebars helper:', function () {
    handlebars.compile('{{glob "fixtures/*.txt"}}')().should.equal('fixtures/a.txt,fixtures/b.txt,fixtures/c.txt');
  });

  it('should expose the options hash:', function () {
    handlebars.compile('{{glob "*.txt" cwd="fixtures"}}')().should.equal('fixtures/a.txt,fixtures/b.txt,fixtures/c.txt');
  });

  it('should work as a handlebars subexpression:', function () {
    var res = handlebars.compile('{{#each (glob "fixtures/*.txt")}}{{.}}{{/each}}')()
    res.should.equal('fixtures/a.txtfixtures/b.txtfixtures/c.txt');

    handlebars.compile([
      '{{#each (glob "fixtures/**/*.hbs")}}',
      '{{read .}}',
      '{{/each}}'
    ].join('\n'))().should.equal('AAA\nBBB\nCCC\n');
  });
});

describe('lodash:', function () {
  it('should work as a lodash mixin:', function () {
    _.mixin({glob: glob.sync, readEach: readEach, read: read});
    _.template('<%= _.glob("fixtures/*.txt") %>', {}).should.equal('fixtures/a.txt,fixtures/b.txt,fixtures/c.txt');
    _.template('<%= _.map(_.glob("fixtures/*.txt"), _.read) %>', {}).should.equal('AAA,BBB,CCC');
    _.template('<%= _.readEach(_.glob("fixtures/*.txt")) %>', {}).should.equal('AAA,BBB,CCC');
  });

  it('should work when passed to lodash on the context:', function () {
    var locals = {glob: glob.sync, readEach: readEach, read: read};
    _.template('<%= glob("fixtures/*.txt") %>', locals).should.equal('fixtures/a.txt,fixtures/b.txt,fixtures/c.txt');
    _.template('<%= _.map(glob("fixtures/*.txt"), read) %>', locals).should.equal('AAA,BBB,CCC');
    _.template('<%= readEach(glob("fixtures/*.txt")) %>', locals).should.equal('AAA,BBB,CCC');
  });

  it('should work as a lodash import:', function () {
    var settings = {imports: {glob: glob.sync, readEach: readEach, read: read}};
    _.template('<%= glob("fixtures/*.txt") %>', {}, settings).should.equal('fixtures/a.txt,fixtures/b.txt,fixtures/c.txt');
    _.template('<%= readEach(glob("fixtures/*.txt")).join("\\n") %>', {}, settings).should.equal('AAA\nBBB\nCCC');
    _.template('<%= _.map(glob("fixtures/*.txt"), read) %>', {}, settings).should.equal('AAA,BBB,CCC');
  });
});