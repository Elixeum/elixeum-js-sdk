#!/bin/sh
set -e

SCRIPT_PATH=$(dirname "$0")
DOCKER_TAG=elixeum-js-sdk:latest
DOCKER_TEMP_NAME=elixeum-js-sdk-tmp
DOCKER_NODE_ENV=${1:-production}
DOCKER_INNER_DIST_PATH=/source/dist
DOCKER_OUTER_DIST_PATH=./artifacts
DOCKER_DOCKERFILE_PATH=$SCRIPT_PATH/../

echo "- Remove if exist and create the local directory if it does not exist"
rm -rf $DOCKER_OUTER_DIST_PATH
mkdir -p $DOCKER_OUTER_DIST_PATH

echo "- Build image '$DOCKER_TAG'"
docker build --tag "$DOCKER_TAG" "$DOCKER_DOCKERFILE_PATH" --build-arg="NODE_ENV=$DOCKER_NODE_ENV"

echo "- Run temp container '$DOCKER_TEMP_NAME'"
docker create --name $DOCKER_TEMP_NAME $DOCKER_TAG

echo "- Copy files from temp container '$DOCKER_INNER_DIST_PATH' to local '$DOCKER_OUTER_DIST_PATH'"
docker cp $DOCKER_TEMP_NAME:$DOCKER_INNER_DIST_PATH/. $DOCKER_OUTER_DIST_PATH

echo "- Stop and remove temp container '$DOCKER_TEMP_NAME'"
docker stop $DOCKER_TEMP_NAME
docker rm $DOCKER_TEMP_NAME
