var jsdom = require('mocha-jsdom');
var should = require('chai').should();
var expect = require('chai').expect;


var lib = require('../website/js/utils');

describe('Util Tests', function() {

	jsdom() // binds to before

    describe('#getLocation()', function() {
        it('should return correct location object', function() {
            const url = 'http://web-infographic-dev.com:3000/pathname/?search=test#hash';
            const result = lib.getLocation(url);
            expect(result).to.be.deep.equal({
                protocol: 'http:',
                hostname: 'web-infographic-dev.com',
                port: '3000',
                pathname: '/pathname/',
                search: '?search=test',
                hash: '#hash',
                host: 'web-infographic-dev.com:3000'
            });
        });
    });

    describe('#getBackendUrlBasedOnFrontendLocation()', function() {
    	it('should return correct localhost backend url', function() {
    		const url = 'http://localhost:8080/internal.html';
            const result = lib.getBackendUrlBasedOnLocation( url );
            result.should.be.a( 'string')
            result.should.equal( 'localhost:3000')
    	});
    });
});
