# Post Media service

## 1. Deploy

### Localhost
Create a directory `env` in the same level of the root directory.

Download the **serviceAccountKey** from Firebase dashboard and save it in the `./env` directory.

Provide a Project ID as shown below before starting the Node.js Emulator: 
```
functions config set projectId YOUR_PROJECT_ID
```

Starting and stopping the Node.js Emulator
Before you can deploy a function, you need to start the Node.js Emulator: (if you are using nvm, maybe you need to use `sudo` command)
```
functions start
```

You stop the Node.js Emulator by calling stop:
```
functions stop
```

If the Node.js Emulator fails to stop for any reason, you can use the kill command to forcibly terminate the underlying process:
```
functions kill
```

Create a file ``./env/.envdevelopment.json`` and replace the values with your localhost information.
```json
{
  "SHERPON_ENV": "DEVELOPMENT",
  "FIREBASE_SERVICE_ACCOUNT": "./env/serviceAccountKey.development.json",
  "MICROSERVICES_ENDPOINT":  "http://localhost:8010/sherpon-staging/us-central1/",
  "ADMIN_APP_URL":"http://0.0.0.0:4000",
  "MYSQL_HOST": "localhost",
  "MYSQL_PORT": 8889,
  "MYSQL_USER": "root",
  "MYSQL_PASSWORD": "root",
  "MYSQL_DATABASE": "sherpon"
}
```

You could get the **MICROSERVICES_ENDPOINT** with the next line:
```
functions status
```
You will get a table with the next row:
```
HTTP Triggers    │ http://localhost:8010/sherpon-staging/us-central1/:function  
```

Deploying functions to the Node.js Emulator uses the same syntax as the gcloud command-line tool.
To deploy the HTTP function to the Node.js Emulator:
```
functions deploy postMedia \
  --trigger-http
```

### Staging
Set the project to deploy: 
```
gcloud config set project [PROJECT]
```

Create a file ``/env/.env.staging.yaml`` and replace the values with your staging information.
```yaml
SHERPON_ENV: STAGING
MICROSERVICES_ENDPOINT: https://{functions-endpoint}.cloudfunctions.net/
ADMIN_APP_URL: {https://my-admin-domain.com}
INSTANCE_CONNECTION_NAME: /cloudsql/{YOUR INSTANCE CONNECTION NAME}
MYSQL_USER: root
MYSQL_PASSWORD: root
MYSQL_DATABASE: sherpon
```

```
gcloud functions deploy postMedia \
  --env-vars-file ./env/.env.staging.yaml \
  --runtime nodejs8 \
  --trigger-http
```

### Production
Set the project to deploy: 
```
gcloud config set project [PROJECT]
```

Create a file ``/env/.env.production.yaml`` and replace the values with your production information.
```yaml
SHERPON_ENV: PRODUCTION
MICROSERVICES_ENDPOINT: https://{functions-endpoint}.cloudfunctions.net/
ADMIN_APP_URL: {https://my-admin-domain.com}
INSTANCE_CONNECTION_NAME: /cloudsql/{YOUR INSTANCE CONNECTION NAME}
MYSQL_USER: root
MYSQL_PASSWORD: root
MYSQL_DATABASE: sherpon
```

```
gcloud functions deploy postMedia \
  --env-vars-file ./env/.env.production.yaml \
  --runtime nodejs8 \
  --trigger-http
```

## 2. Debugger
Run the Function Emulator like localhost deploy. Then execute the follow line.
```
functions deploy postMedia \
  --trigger-http \
  --timeout=50000
```

If you want to inspect it, place the debugger on any line and execute the line below:
```
functions inspect postMedia
```

For more information:
```
functions logs read
```


## 3. References
1. Using Environment Variables [https://cloud.google.com/functions/docs/env-var](https://cloud.google.com/functions/docs/env-var)
2. Cloud Functions Node.js Emulator [https://cloud.google.com/functions/docs/emulator](https://cloud.google.com/functions/docs/emulator)
3. Testing and CI/CD [https://cloud.google.com/functions/docs/bestpractices/testing](https://cloud.google.com/functions/docs/bestpractices/testing)
4. Building, testing, and deploying artifacts [https://cloud.google.com/cloud-build/docs/configuring-builds/build-test-deploy-artifacts](https://cloud.google.com/cloud-build/docs/configuring-builds/build-test-deploy-artifacts)
