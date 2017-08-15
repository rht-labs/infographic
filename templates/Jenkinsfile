#!/usr/bin/groovy

/**
 this section of the pipeline executes on the master, which has a lot of useful variables that we can leverage to configure our pipeline
 **/
node (''){
    // these should align to the projects in the Application Inventory
    env.OPENSHIFT_BUILD_NAMESPACE = "infographic-pipeline"
    env.DEV_PROJECT = "infographic-dev"
    env.TEST_PROJECT = "infographic-test"
    env.UAT_PROJECT = "infographic-uat"


    env.APP_NAME = "httpd-app"

    // these are defaults that will help run openshift automation
    env.OCP_API_SERVER = "${env.OPENSHIFT_API_URL}"
    env.OCP_TOKEN = readFile('/var/run/secrets/kubernetes.io/serviceaccount/token').trim()
}

// Using the nodejs slave because it is included by default with Jenkins. Due to no requirements
// for these operations, any slave should be fine.
node('nodejs') {

    stage('SCM Checkout') {
        checkout scm
    }

    // Bundles up the current directory and sends it to OpenShift to run the s2i.
    stage('Build Image') {
        sh "oc start-build ${env.APP_NAME} --from-dir=. --follow"
    }


    // no user changes should be needed below this point
    stage ('Deploy to Dev') {
        input "Promote Application to Dev?"

        openshiftTag (apiURL: "${env.OCP_API_SERVER}", authToken: "${env.OCP_TOKEN}", destStream: "${env.APP_NAME}", destTag: 'latest', destinationAuthToken: "${env.OCP_TOKEN}", destinationNamespace: "${env.DEV_PROJECT}", namespace: "${env.OPENSHIFT_BUILD_NAMESPACE}", srcStream: "${env.APP_NAME}", srcTag: 'latest')

        openshiftTag (apiURL: "${env.OCP_API_SERVER}", authToken: "${env.OCP_TOKEN}", destStream: "${env.APP_NAME}", destTag: 'latest', destinationAuthToken: "${env.OCP_TOKEN}", destinationNamespace: "${env.DEV_PROJECT}", namespace: "${env.OPENSHIFT_BUILD_NAMESPACE}", srcStream: "${env.APP_NAME}", srcTag: 'latest')


        openshiftVerifyDeployment (apiURL: "${env.OCP_API_SERVER}", authToken: "${env.OCP_TOKEN}", depCfg: "${env.APP_NAME}", namespace: "${env.DEV_PROJECT}", verifyReplicaCount: true)
    }

    stage ('Deploy to Test') {
        input "Promote Application to Test?"

        openshiftTag (apiURL: "${env.OCP_API_SERVER}", authToken: "${env.OCP_TOKEN}", destStream: "${env.APP_NAME}", destTag: 'latest', destinationAuthToken: "${env.OCP_TOKEN}", destinationNamespace: "${env.TEST_PROJECT}", namespace: "${env.DEV_PROJECT}", srcStream: "${env.APP_NAME}", srcTag: 'latest')

        openshiftVerifyDeployment (apiURL: "${env.OCP_API_SERVER}", authToken: "${env.OCP_TOKEN}", depCfg: "${env.APP_NAME}", namespace: "${env.TEST_PROJECT}", verifyReplicaCount: true)
    }

    stage ('Deploy to UAT') {
        input "Promote Application to UAT?"

        openshiftTag (apiURL: "${env.OCP_API_SERVER}", authToken: "${env.OCP_TOKEN}", destStream: "${env.APP_NAME}", destTag: 'latest', destinationAuthToken: "${env.OCP_TOKEN}", destinationNamespace: "${env.UAT_PROJECT}", namespace: "${env.TEST_PROJECT}", srcStream: "${env.APP_NAME}", srcTag: 'latest')

        openshiftVerifyDeployment (apiURL: "${env.OCP_API_SERVER}", authToken: "${env.OCP_TOKEN}", depCfg: "${env.APP_NAME}", namespace: "${env.UAT_PROJECT}", verifyReplicaCount: true)
    }

}