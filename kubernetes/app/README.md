### PREREQUISITES
Make sure to create an image of your app inside minikube virtual machine

This is similar to podman-env but only for Docker runtime. When using a container or VM driver (all drivers except none), you can reuse the Docker daemon inside minikube cluster. This means you don’t have to build on your host machine and push the image into a docker registry. You can just build inside the same docker daemon as minikube which speeds up local experiments.

To point your terminal to use the docker daemon inside minikube run this:

`eval $(minikube docker-env)`

So if you do the following commands, it will show you the containers inside the minikube, inside minikube’s VM or Container.

`docker ps`

Now you can ‘build’ against the docker inside minikube, which is instantly accessible to kubernetes cluster.

`docker build -t notes-app ./notes-app`



### 1. Create a namespace via kubectl

`kubectl create namespace notes-chart`

### 2. Install helm charts

`helm install notes-chart --namespace notes-chart ./infra/.helm/notes-chart`

### 3. Get the app's url 

`minikube service notes-chart  --url -n notes-chart` 

### 3. Upgrade charts
`helm upgrade notes-chart --namespace notes-chart ./infra/.helm/notes-chart`

### 4. Uninstall charts

`helm uninstall notes-chart --namespace notes-chart`

---
### Lookup a service from any pod
`nslookup [SERICE_NAMAE]`

i.e 
`nslookup postgres` 
as we have a postgres service among out helm charts
---
#### Reference docs: 

[Minikube + Helm](https://siweheee.medium.com/deploy-your-programs-onto-minikube-with-docker-and-helm-a68097e8d545)