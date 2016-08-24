releasePipeline{
    buildCommands = [] 
    ocHost = 'env3-1-master.innovation.labs.redhat.com'
	dockerRegistry = 'registry.env3-1.innovation.labs.redhat.com'
    appName = 'web'
    
	envs = [
		[name: 'Dev', projectName: 'infographic-dev'],
    	[name: 'Stage', projectName: 'infographic-stage' ],
    	[name: 'Production', projectName: 'infographic-prod' ]
   ]
}