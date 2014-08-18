var expect = require('expect.js'),
    devices = require('..');

describe('devices', function() {
  it('should say hello', function(done) {
    expect(devices()).to.equal('Hello, world');
    done();
  });
});
