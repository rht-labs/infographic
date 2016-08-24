releasePipeline{
    buildCommands = [] 
    ocHost = 'master1.env2-1.innovation.labs.redhat.com'
	dockerRegistry = 'registry.apps.env2-1.innovation.labs.redhat.com'
    appName = 'infographic'
    
	envs = [
		[name: 'Dev', projectName: 'infographic-dev'],
    	[name: 'Stage', projectName: 'infographic-stage' ],
    	[name: 'Production', projectName: 'infographic-prod' ]
   ]
}