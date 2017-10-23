# Infographic Infrastructure Automation Demo

## Prerequisistes
* NodeJS
* npm

## Running
Run: 
```bash
npm install
npm run start
```

This will start up a local http server using the `website` directory as the root context of the server.

## Configuration
Configuration of the running application is accomplished using 
environment variables. The configuration options are listed below:

* INFOGRAPHIC_HTTP_PORT
  * Default: 8080
* INFOGRAPHIC_HTTPS_PORT
  * Default: 8443
* INFOGRAPHIC_HTTPS_KEY
  * Default: Undefined
* INFOGRAPHIC_HTTPS_CERTIFICATE
  * Default: Undefined
* INFOGRAPHIC_DIR
  * Default: `website` (Do not change unless you know what you are doing)
* ANSIBLE_TOWER_URL
  * Default: **NONE (Required)**
  * REST API base URL for Ansible Tower
* ANSIBLE_TOWER_TEMPLATE_ID
  * Default: **NONE (Required)**
  * The template ID of the template to be used in Ansible Tower
* OPENSHIFT_API_URL
  * Default: **NONE (Required)**
  * The base URL of the OpenShift REST API
* NODE_TLS_REJECT_UNAUTHORIZED
  * Default: 0 (SSL Verification enabled)
  * Enable/Disable unsafe SSL (disables certificate validation)