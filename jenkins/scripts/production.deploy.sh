#!/usr/bin/env sh

gcloud auth activate-service-account --key-file $SHERPON_PRODUCTION_SERVICE_ACCOUNT_KEY
gcloud functions deploy $SHERPON_MICROSERVICES_FUNCTION_NAME \
  --env-vars-file $SHERPON_MICROSERVICES_PRODUCTION_ENV \
  --runtime nodejs8 \
  --trigger-http \
  --quiet --project $SHERPON_PRODUCTION_PROJECT_ID