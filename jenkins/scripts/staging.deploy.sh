#!/usr/bin/env sh

gcloud auth activate-service-account --key-file $SHERPON_STAGING_SERVICE_ACCOUNT_KEY
gcloud functions deploy $SHERPON_MICROSERVICES_FUNCTION_NAME \
  --runtime nodejs8 \
  --trigger-http \
  --quiet --project $SHERPON_STAGING_PROJECT_ID