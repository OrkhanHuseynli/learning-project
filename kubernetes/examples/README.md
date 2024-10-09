## kubectl

The Kubernetes command-line tool, kubectl, allows you to run commands against Kubernetes clusters. You can use kubectl to deploy applications, inspect and manage cluster resources, and view logs. For more information including a complete list of kubectl operations, see the kubectl reference documentation.

[Install kubectl on macOS ](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)

### Verify kubectl configuration 

`kubectl cluster-info`

## minikube start
minikube is local Kubernetes, focusing on making it easy to learn and develop for Kubernetes.

All you need is Docker (or similarly compatible) container or a Virtual Machine environment, and Kubernetes is a single command away: minikube start

`curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-arm64`

`sudo install minikube-darwin-arm64 /usr/local/bin/minikube`


### 1. Start your cluster
From a terminal with administrator access (but not logged in as root), run:

`minikube start`

If minikube fails to start, see the drivers page for help setting up a compatible container or virtual-machine manager.


### 2. Interact with your cluster
If you already have kubectl installed (see documentation), you can now use it to access your shiny new cluster:

`kubectl get po -A`

Initially, some services such as the storage-provisioner, may not yet be in a Running state. This is a normal condition during cluster bring-up, and will resolve itself momentarily. For additional insight into your cluster state, minikube bundles the Kubernetes Dashboard, allowing you to get easily acclimated to your new environment:

`minikube dashboard`

### Create deployment

`kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080`


### Create pod based on yaml
`kubectl create -f pod-definition.yml`

#### Delete pod
# Delete a pod using the type and name specified in pod.json
  `kubectl delete -f ./pod-definition.yml`


### Create replica-sets
    kubectl create -f replicaset-definition.yml

    kubectl get replicaset


#### Update / Scale replicaset
    kubectl replace -f replicaset-definition.yml


## HELM

`helm install --debug --dry-run goodly-guppy ./mychart` 