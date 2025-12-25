#!/bin/sh

PATH=${PATH}:~/work/develop/sonar-scanner-8.0.1.6346-macosx-aarch64/bin/

sonar-scanner \
  -Dsonar.projectKey=Conjugator \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://127.0.0.1:9000 \
  -Dsonar.token=sqp_27cb9f46fa77d53ab5014631188e2a3558db1978
