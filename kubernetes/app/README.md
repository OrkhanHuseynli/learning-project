### 1. Create a namespace via kubectl

`kubectl create namespace notes-chart`

### 2. Install helm charts

`helm install notes-chart --namespace notes-chart ./infra/.helm/notes-chart`

### 3. Get the app's url 

`minikube service notes-chart  --url -n notes-chart` 


### 3. Uninstall charts

`helm uninstall notes-chart --namespace notes-chart`