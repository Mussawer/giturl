"use strict";

// host[:/]n1/n2
var RE = /^([^:\/]+)[:\/](.+)$/i;

var HTTPS_HOSTS = {
  'github.com': 1,
  'gitcafe.com': 1,
  'gist.github.com': 1,
  'bitbucket.org': 1,
};

exports.parse = function parse(sourceURL) {
  if (!sourceURL || typeof sourceURL !== 'string') {
    return '';
  }

  var url = sourceURL;

  var originProtocol;
  try {
    var uo = new URL(url);
    originProtocol = uo.protocol;
  } catch (_) {}

  if (url.indexOf('@') >= 0) {
    url = url.replace(/^[^@]+@/, '');    // `git@`` || `https://jpillora@` => ""
  }
  url = url.replace(/^[\w+]+:\/\//, '')    // `git://` || `git+https://` => ""
    .replace(/\.git$/, '');             // .git => ""
  var item = RE.exec(url);
  if (!item) {
    return sourceURL;
  }

  var host = item[1];

  var protocol;
  if (HTTPS_HOSTS[host]) {
    protocol = 'https:';
  } else if ([ 'https:', 'http:' ].includes(originProtocol)) {
    protocol = originProtocol;
  } else {
    protocol = 'http:';
  }

  // p1/p2/.../pn[.xxx]
  var isContainGit = /\.git$/.test(sourceURL);
  var url = isContainGit ? item[2] : item[2].split('/', 2).join('/');
  return protocol + '//' + host + '/' + url;
};

// Extracts host, owner, repository name, and branch (if present) from a Git URL, returning null for invalid URLs
exports.extractInfo = function extractInfo(sourceURL) {
  var webURL = exports.parse(sourceURL);
  if (!webURL) return null;

  try {
    var urlParts = new URL(webURL);
    var pathParts = urlParts.pathname.split('/').filter(Boolean);

    var info = {
      host: urlParts.hostname,
      owner: pathParts[0],
      name: pathParts.slice(1).join('/'),
      branch: null
    };

    // Check if URL contains a branch name
    var treeIndex = pathParts.indexOf('tree');
    if (treeIndex !== -1 && pathParts.length > treeIndex + 1) {
      info.branch = pathParts[treeIndex + 1];
      info.name = pathParts.slice(1, treeIndex).join('/');
    }

    return info;
  } catch (error) {
    // Return null for invalid URLs
    return null;
  }
};