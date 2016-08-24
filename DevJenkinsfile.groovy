developmentPipeline{
    buildCommands = []//['npm install','npm run-script ci'] TODO fix Jenkins tools
    unitTestCommand = //'npm test'
    ocHost = 'env3-1-master.innovation.labs.redhat.com'
    projectName = 'infographic'
    appName = 'web'
    dockerRegistry = 'registry.env3-1.innovation.labs.redhat.com'
}