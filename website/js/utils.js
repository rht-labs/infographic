function getLocation(url) {
  const link = document.createElement('a');
  link.href = url;
  return {
    protocol: link.protocol,
    hostname: link.hostname,
    port: link.port,
    pathname: link.pathname,
    search: link.search,
    hash: link.hash,
    host: link.host
  };
}

function getBackendUrlBasedOnLocation( url ){
  const location = getLocation( url )
  
  if (location.hostname.includes('localhost') || location.hostname.includes('127.0.0.1')) {
      return 'http://localhost:3000'
  } else {
      const result = location.hostname.match( /(infographic-[a-z]+)/g );
      if ( result == null || result.length == 0 || result.length > 1 ){
        return ''
      } else {
        return 'http://node-app-' + result[0] + getOpenShiftHostFromHostName( location.hostname );
      }
  }

}



function getOpenShiftHostFromHostName( hostName ){

  const result = hostName.match(/(([.]{1})([a-z0-9\-]+))+/g);
  if ( result == null || result.length == 0 || result.length > 1 ){
    return ''
  } else {
    return result[0]
  }
 
}

function passwordRequired(cb){
  console.log(window.location.href );
  var url = getBackendUrlBasedOnLocation( window.location.href ) + '/passwordRequired'
  $.get(url,  function(result){
        cb(result);
  })
}


exports.getBackendUrlBasedOnLocation = getBackendUrlBasedOnLocation
exports.getLocation = getLocation
exports.getOpenShiftHostFromHostName = getOpenShiftHostFromHostName