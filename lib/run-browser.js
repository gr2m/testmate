#!/usr/bin/env node
'use strict';

var path = require('path');
var spawn = require('child_process').spawn;

var wd = require('wd');
var sauceConnectLauncher = require('sauce-connect-launcher');
var querystring = require('querystring');
var request = require('request').defaults({json: true});

var beefy = require('beefy');
var http = require('http');
var selenium = require('selenium-download');

var SELENIUM_HUB = 'http://localhost:4444/wd/hub/status';

var testTimeout = 30 * 60 * 1000;

var username = process.env.SAUCE_USERNAME;
var accessKey = process.env.SAUCE_ACCESS_KEY;

module.exports = function(options, callback) {
  wd.configureHttp({timeout: 180000}); // 3 minutes

  // BAIL=0 to disable bailing
  var bail = options.bail !== '0';

  // options.client is a colon seperated list of
  // (saucelabs|selenium):browserName:browserVerion:platform
  var tmp = (options.client || 'selenium:firefox').split(':');
  var client = {
    runner: tmp[0] || 'selenium',
    browser: tmp[1] || 'firefox',
    version: tmp[2] || null, // Latest
    platform: tmp[3] || null
  };

  var testUrl = 'http://127.0.0.1:8000/';
  var qs = {
    testFiles: options.testFiles.join(',')
  };

  var sauceClient;
  var sauceConnectProcess;
  var tunnelId = process.env.TRAVIS_JOB_NUMBER || 'tunnel-' + Date.now();

  if (client.runner === 'saucelabs') {
    qs.saucelabs = true;
  }
  if (options.grep) {
    qs.grep = options.grep;
  }
  if (options.adapters) {
    qs.adapters = options.adapters;
  }

  testUrl += '?';
  testUrl += querystring.stringify(qs);

  if (process.env.TRAVIS &&
      client.runner === 'saucelabs' &&
      process.env.TRAVIS_SECURE_ENV_VARS === 'false') {
    console.error('Not running test, cannot connect to saucelabs');
    callback();
    return;
  }

  function testError(e) {
    console.error(e);
    console.error('Doh, tests failed');
    sauceClient.quit();
    callback(3);
  }

  function testComplete(result) {

    sauceClient.quit().then(function () {
      if (sauceConnectProcess) {
        sauceConnectProcess.close(function() {
          callback(result.failed ? 1 : 0);
        });
      } else {
        callback(result.failed ? 1 : 0);
      }
    });
  }

  function startSelenium(callback) {

    var SELENIUM_PATH = '../vendor/selenium.jar';
    var CHROMEDRIVER_PATH = '../vendor/chromedriver';

    // https://www.npmjs.com/package/selenium-download
    selenium.ensure(path.resolve(__dirname, '../vendor'), function(error) {
      if (error) {
        return callback(error);
      }

      // Start selenium
      spawn('java', ['-jar', path.resolve(__dirname, SELENIUM_PATH), '-Dwebdriver.chrome.driver=' + path.resolve(__dirname, CHROMEDRIVER_PATH)], {});

      var retries = 0;
      var started = function () {

        if (++retries > 60) {
          console.error('Unable to connect to selenium');
          callback(1);
          return;
        }

        request(SELENIUM_HUB, function (err, resp) {
          if (resp && resp.statusCode === 200) {
            sauceClient = wd.promiseChainRemote();
            callback();
          } else {
            setTimeout(started, 1000);
          }
        });
      };

      started();

    });
  }

  function startSauceConnect(callback) {

    var options = {
      username: username,
      accessKey: accessKey,
      tunnelIdentifier: tunnelId
    };

    sauceConnectLauncher(options, function (err, process_) {
      if (err) {
        console.error('Failed to connect to saucelabs');
        console.error(err);
        return callback(1);
      }
      sauceConnectProcess = process_;
      sauceClient = wd.promiseChainRemote('localhost', 4445, username, accessKey);
      callback();
    });
  }

  function startTest() {

    console.log('Starting', client);

    var opts = {
      browserName: client.browser,
      version: client.version,
      platform: client.platform,
      tunnelTimeout: testTimeout,
      name: client.browser + ' - ' + tunnelId,
      'max-duration': 60 * 45,
      'command-timeout': 599,
      'idle-timeout': 599,
      'tunnel-identifier': tunnelId
    };

    sauceClient.init(opts).get(testUrl, function () {

      /* jshint evil: true */
      var interval = setInterval(function () {
        sauceClient.eval('window.results', function (err, results) {
          if (err) {
            clearInterval(interval);
            testError(err);
          } else if (results.completed || (results.failures.length && bail)) {
            clearInterval(interval);
            testComplete(results);
          } else {
            console.log('=> ', results);
          }
        });
      }, 10 * 1000);
    });
  }

  var fullTestFilePaths = options.testFiles.reduce(function(map, file) {
    map['/'+file] = path.resolve(process.cwd(), file);
    return map;
  }, {});

  http.createServer(beefy({
    entries: fullTestFilePaths,
    cwd: path.resolve(__dirname, '../')
  })).listen(8000);

  if (client.runner === 'saucelabs') {
    startSauceConnect(startTest);
  } else {
    startSelenium(startTest);
  }

};
