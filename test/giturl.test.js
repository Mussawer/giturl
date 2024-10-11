/**!
 * giturl - test/giturl.test.js
 *
 * Copyright(c) 2014
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var should = require('should');
var giturl = require('../');

describe('giturl.test.js', function () {
  describe('parse()', function () {
    it('should parse project web url from giturl', function () {
      giturl.parse('git://gitlab.com/edp/logger.git').should.equal('http://gitlab.com/edp/logger');
      giturl.parse('git@gitlab.com:edp/logger.git').should.equal('http://gitlab.com/edp/logger');
      giturl.parse('git://github.com/treygriffith/cellar.git').should.equal('https://github.com/treygriffith/cellar');
      giturl.parse('git@gitlab.xxx.com:frontend/arch/xxx.git').should.equal('http://gitlab.xxx.com/frontend/arch/xxx');
      giturl.parse('https://github.com/banchee/tranquil.git').should.equal('https://github.com/banchee/tranquil');
      giturl.parse('https://github.com/banchee/tranquil').should.equal('https://github.com/banchee/tranquil');
      giturl.parse('http://github.com/banchee/tranquil.git').should.equal('https://github.com/banchee/tranquil');
      giturl.parse('git+https://github.com/banchee/tranquil.git').should.equal('https://github.com/banchee/tranquil');
      giturl.parse('github.com/banchee/tranquil.git').should.equal('https://github.com/banchee/tranquil');
      giturl.parse('https://jpillora@github.com/banchee/tranquil.git').should.equal('https://github.com/banchee/tranquil');
      giturl.parse('git@github.com:cnpm/cnpm.git').should.equal('https://github.com/cnpm/cnpm');
      giturl.parse('github.com:cnpm/cnpm.git').should.equal('https://github.com/cnpm/cnpm');
      giturl.parse('git@github.com:cnpm/cnpm').should.equal('https://github.com/cnpm/cnpm');
      giturl.parse('git@gitcafe.com:fengmk2/cnpm.git').should.equal('https://gitcafe.com/fengmk2/cnpm');
      giturl.parse('git@gist.github.com:3135914.git').should.equal('https://gist.github.com/3135914');
    });

    it('should parse not git url', function () {
      giturl.parse('http://bauer-information-technology.com/').should.eql('http://bauer-information-technology.com/');
      giturl.parse('').should.eql('');
    });

    it('should parse github archive url', function () {
      giturl.parse('http://github.com/component/emitter/archive/1.0.1.tar.gz')
        .should.equal('https://github.com/component/emitter');
      giturl.parse('http://github.com/emitter/archive/1.0.1.tar.gz')
        .should.equal('https://github.com/emitter/archive');
      giturl.parse('http://github.com/emitter/')
        .should.equal('https://github.com/emitter/');
    });

    it('should parse gist url', function () {
      giturl.parse('https://gist.github.com/fengmk2/10453258')
        .should.equal('https://gist.github.com/fengmk2/10453258');
      giturl.parse('http://gist.github.com/fengmk2/10453258')
        .should.equal('https://gist.github.com/fengmk2/10453258');
      giturl.parse('http://gist.github.com/10453258.git')
        .should.equal('https://gist.github.com/10453258');
    });

    it('should parse protocol', function () {
      giturl.parse('http://git.foo.com/foo/bar').should.equal('http://git.foo.com/foo/bar');
      giturl.parse('https://git.foo.com/foo/bar').should.equal('https://git.foo.com/foo/bar');
      giturl.parse('git://git.foo.com/foo/bar.git').should.equal('http://git.foo.com/foo/bar');
    });

    // Tests parse() function for correct handling of various Bitbucket URL formats
    it('should parse Bitbucket URLs', function () {
      giturl.parse('git@bitbucket.org:username/repo.git').should.equal('https://bitbucket.org/username/repo');
      giturl.parse('https://username@bitbucket.org/username/repo.git').should.equal('https://bitbucket.org/username/repo');
      giturl.parse('git://bitbucket.org/username/repo.git').should.equal('https://bitbucket.org/username/repo');
    });
  });
});

describe('extractInfo()', function () {
  // Tests extractInfo() function for correct extraction of repository information from a GitHub URL
  it('should extract repository information from GitHub URL', function () {
    var info = giturl.extractInfo('https://github.com/user/repo.git');
    should.deepEqual(info, {
      host: 'github.com',
      owner: 'user',
      name: 'repo',
      branch: null
    });
  });

  // Tests extractInfo() function for correct extraction of repository information from a GitLab URL
  it('should extract repository information from GitLab URL', function () {
    var info = giturl.extractInfo('git@gitlab.com:user/repo.git');
    should.deepEqual(info, {
      host: 'gitlab.com',
      owner: 'user',
      name: 'repo',
      branch: null
    });
  });

  // Tests extractInfo() function to ensure it returns null for invalid URLs
  it('should return null for invalid URLs', function () {
    var result = giturl.extractInfo('invalid-url');
    should.equal(result, null);
  });

  // Tests extractInfo() function for correct handling of GitLab URLs with subgroup repositories
  it('should handle subgroup repositories in GitLab', function () {
    var info = giturl.extractInfo('https://gitlab.com/group/subgroup/repo.git');
    should.deepEqual(info, {
      host: 'gitlab.com',
      owner: 'group',
      name: 'subgroup/repo',
      branch: null
    });
  });
});
