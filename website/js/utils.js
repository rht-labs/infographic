/*-
 * Infographic Infrastructure Automation Demo
 * %%
 * Copyright (C) 2016 - 2017 Red Hat Inc., Open Innovation Labs
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
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

exports.getBackendUrlBasedOnLocation = getBackendUrlBasedOnLocation
exports.getLocation = getLocation
exports.getOpenShiftHostFromHostName = getOpenShiftHostFromHostName