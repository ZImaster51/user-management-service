def buildNumber = env.BUILD_NUMBER as int
if (buildNumber > 1) milestone(buildNumber - 1)
milestone(buildNumber)


def git_repo = ""
def git_branch = "master"

//if use nexus as data artefact
def env = ''
def nexus_base_url = ''
def nexus_deps_repo = "$nexus_base_url/repository/dealls/"
def nexus_deploy_repo = "$nexus_base_url/repository/dealls/"



def appName = 'user-management-service'
def pomappName
def appFullVersion
def gitCommitId


node ('master'){
    stage('Checkout') {
        git url: "${git_repo}", branch: "${git_branch}", credentialsId: 'git'
    }
    stage('Prepare'){
        withCredentials([[$class: 'UsernamePasswordMultiBinding', 
            credentialsId: 'library',
            usernameVariable: 'nexus_username', passwordVariable: 'nexus_password']]) {
                sh """
                    echo 'Downloading ci-cd templates...'
                    curl --fail -u ${nexus_username}:${nexus_password} -o cicd-template.tar.gz ${nexus_base_url}/repository/{name-path}}/cicd-template-${env}.tar.gz
                    rm -rf cicd-template
                    mkdir cicd-template && tar -xzvf ./cicd-template.tar.gz -C "\$(pwd)/cicd-template"
                    chmod -R 777 "\$(pwd)/cicd-template"
                    """
                prepareSettingsXml(nexus_deps_repo, nexus_username, nexus_password)
                addDistributionToPom(nexus_deploy_repo)
        }

    }


    stage ('Docker Build'){
        sh """
        docker build --rm -t {url-image-registry}/path/${appName}-v${appMajorVersion} .
      """
    }
    
    stage ('Docker Push'){
        sh """
        docker push {url-image-registry}/path/${appName}-v${appMajorVersion} 
      """
    }
    stage ('Deploy to GKE'){
        environtment {
            APP_NAME = '${appName}' \
            APP_FULL_VERSION='${appFullVersion}' \
            APP_ROUTE_PATH="/${micrositeName}"
        }
        withCredentials([file(credentialsId: 'gke-jenkins', variable: 'GC_KEY')]) {
            sh """
                set -x
                set -e
                
                gcloud auth activate-service-account --key-file {cred-on gke}
                gcloud container clusters {connect-to-cluster-kubernetes}
                
                kubectl apply -f deployment.yaml
                kubectl apply -f ingress.yaml
            """
        }
    }
}



def prepareSettingsXml(nexus_deps_repo, nexus_username, nexus_password) {
    settingsXML = readFile('./path/settings.xml') 
    settingsXML = settingsXML.replaceAll('\\$nexus_deps_repo', nexus_deps_repo)
    settingsXML = settingsXML.replaceAll('\\$nexus_username', nexus_username)
    settingsXML = settingsXML.replaceAll('\\$nexus_password', nexus_password)

    writeFile file: './path/settings.xml', text: settingsXML
}
