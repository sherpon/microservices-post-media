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

Create a file ``./env/development.env.json`` and replace the values with your localhost information.
```json
{
  "SHERPON_ENV": "DEVELOPMENT",
  "GOOGLE_PROJECT_ID": "my-sherpon",
  "GOOGLE_SERVICE_ACCOUNT": "./env/serviceAccountKey.development.json",
  "FIREBASE_SERVICE_ACCOUNT": "./env/serviceAccountKey.development.json",
  "GOOGLE_STORAGE_BUCKET": "my-sherpon",
  "WEBSITE_STORAGE_INIT": 900,
  "MICROSERVICES_ENDPOINT": "http://localhost:8010/my-sherpon/us-central1",
  "CREATOR_ENDPOINT": "http://creator.sherpon.localhost:7000",
  "DOMAIN_MANAGER_ENDPOINT": "http://domain-manager.sherpon.localhost:7000",
  "ADMIN_APP_URL": "http://0.0.0.0:4000",
  "PAYMENT_PROCESSOR": "CULQI",
  "PAYMENT_PROCESSOR_PUBLIC_KEY": "public_key_1234567890",
  "PAYMENT_PROCESSOR_PRIVATE_KEY": "private_key_1234567890"
}
```

You could get the **MICROSERVICES_ENDPOINT** with the next line:
```
functions status
```
You will get a table with the next row:
```
HTTP Triggers    │ http://localhost:8010/my-sherpon/us-central1/:function  
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

Create a file ``/env/staging.env.yaml`` and replace the values with your staging information.
```yaml
SHERPON_ENV: STAGING
GOOGLE_PROJECT_ID: my-sherpon
GOOGLE_SERVICE_ACCOUNT: ./env/serviceAccountKey.development.json
FIREBASE_SERVICE_ACCOUNT: ./env/serviceAccountKey.development.json
GOOGLE_STORAGE_BUCKET: my-sherpon
WEBSITE_STORAGE_INIT: "900"
MICROSERVICES_ENDPOINT: https://us-central1-my-sherpon.cloudfunctions.net/
CREATOR_ENDPOINT: https://creator.my-sherpon.com
DOMAIN_MANAGER_ENDPOINT: https://domain-manager.my-sherpon.com
ADMIN_APP_URL: https://admin.my-sherpon.com
PAYMENT_PROCESSOR: CULQI
PAYMENT_PROCESSOR_PUBLIC_KEY": public_key_1234567890
PAYMENT_PROCESSOR_PRIVATE_KEY": private_key_1234567890
```

```
gcloud functions deploy postMedia \
  --env-vars-file ./env/staging.env.yaml \
  --runtime nodejs8 \
  --trigger-http
```

### Production
Set the project to deploy: 
```
gcloud config set project [PROJECT]
```

Create a file ``/env/production.env.yaml`` and replace the values with your production information.
```yaml
SHERPON_ENV: PRODUCTION
GOOGLE_PROJECT_ID: my-sherpon
GOOGLE_SERVICE_ACCOUNT: ./env/serviceAccountKey.development.json
FIREBASE_SERVICE_ACCOUNT: ./env/serviceAccountKey.development.json
GOOGLE_STORAGE_BUCKET: my-sherpon
WEBSITE_STORAGE_INIT: "900"
MICROSERVICES_ENDPOINT: https://us-central1-my-sherpon.cloudfunctions.net/
CREATOR_ENDPOINT: https://creator.my-sherpon.com
DOMAIN_MANAGER_ENDPOINT: https://domain-manager.my-sherpon.com
ADMIN_APP_URL: https://admin.my-sherpon.com
PAYMENT_PROCESSOR: CULQI
PAYMENT_PROCESSOR_PUBLIC_KEY": public_key_1234567890
PAYMENT_PROCESSOR_PRIVATE_KEY": private_key_1234567890
```

```
gcloud functions deploy postMedia \
  --env-vars-file ./env/production.env.yaml \
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
