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
    return ''
  }

}

exports.getBackendUrlBasedOnLocation = getBackendUrlBasedOnLocation
exports.getLocation = getLocation
