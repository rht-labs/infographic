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

    	it('should return correct dev backend url', function() {
    		const url = 'http://web-infographic-dev.apps.env2-1.innovation.labs.redhat.com';
            const result = lib.getBackendUrlBasedOnLocation( url );
            result.should.be.a( 'string')
            result.should.equal( 'http://node-app-infographic-dev.apps.env2-1.innovation.labs.redhat.com')
    	});


    	it('should return correct stage backend url', function() {
    		const url = 'http://web-infographic-stage.apps.env2-1.innovation.labs.redhat.com';
            const result = lib.getBackendUrlBasedOnLocation( url );
            result.should.be.a( 'string')
            result.should.equal( 'http://node-app-infographic-stage.apps.env2-1.innovation.labs.redhat.com')
    	});

    	it('should return correct prod backend url', function() {
    		const url = 'http://web-infographic-prod.apps.env2-1.innovation.labs.redhat.com';
            const result = lib.getBackendUrlBasedOnLocation( url );
            result.should.be.a( 'string')
            result.should.equal( 'http://node-app-infographic-prod.apps.env2-1.innovation.labs.redhat.com')
    	});

    	it('should return correct developer backend url', function() {
    		const url = 'http://web-infographic-developerlastname.apps.env2-1.innovation.labs.redhat.com';
            const result = lib.getBackendUrlBasedOnLocation( url );
            result.should.be.a( 'string')
            result.should.equal( 'http://node-app-infographic-developerlastname.apps.env2-1.innovation.labs.redhat.com')
    	});
    });

    describe('#getOpenShiftHostFromLocation()', function(){
    	it('should return the correct OpenShift host from the location', function(){
    		const result = lib.getOpenShiftHostFromHostName( 'web-infographic-dev.env3-1.innovation.labs.redhat.com' );
    		result.should.be.a( 'string' )
    		result.should.equals( '.env3-1.innovation.labs.redhat.com' )
    	});

    	it('should return empty for localhost', function(){
    		const result = lib.getOpenShiftHostFromHostName( 'localhost:8080' );
    		result.should.be.a( 'string' )
    		expect( result ).to.be.empty
    	});
    });

});
