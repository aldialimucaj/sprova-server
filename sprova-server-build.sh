#!/bin/bash
export SPROVA_SERVER_V=`node -e "console.log(require('./package.json').version)"`
echo Building Sprova Server version $SPROVA_SERVER_V
docker build -t mjeshtri/sprova-server:$SPROVA_SERVER_V .
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push mjeshtri/sprova-server:$SPROVA_SERVER_V

