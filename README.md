# Red Hat Open Innovation Labs infographic website

## Getting started

Run these commands to run the application locally:

```
npm install
npm start
```

These commands will start a local server that hosts both the front end and back end of the site at `localhost:8443` (if an HTTPS certificate is provided) or `localhost:8080` (if no HTTPS certificate is provided). In OpenShift-based environments, the front end and back end are hosted as separate applications, using the templates in the `templates` directory.

## Important URLs:

- `/index.html`: The public-facing infographic page. Clicking the "build" button takes the user to the Open Innovation Labs website.
- `/internal.html`: The "internal" version of infographic. Clicking the "build" button kicks off an Ansible job.
- `/stack`: The node.js API that the front end hits when the user clicks the "build" button. This API passes the request on to Ansible.
