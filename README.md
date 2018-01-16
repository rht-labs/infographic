# Red Hat Open Innovation Labs Infographic

## Prerequisistes
* NodeJS
* npm

## Running
Run:
```bash
npm install
npm start
```

This will start up a local http server to host the fron using the `website` directory as the root context of the front end application. This local devleopment server will also host the API. In OpenShift-based environments, the front end and back end are hosted as separate applications, using the templates in the `templates` directory.

## Important paths

- `/index.html`: The public-facing infographic page. Clicking the "build" button takes the user to the Open Innovation Labs website.
- `/internal.html`: The "internal" version of infographic. Clicking the "build" button kicks off an Ansible job.
- `/stack`: The node.js API that the front end hits when the user clicks the "build" button. This API passes the request on to Ansible.

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
