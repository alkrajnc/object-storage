


source .env




if [ "$(docker ps -q -f name=$DOCKER_CONTAINER_NAME)" ]; then
  echo "Database container '$DOCKER_CONTAINER_NAME' already running"
  exit 0
fi

if [ "$(docker ps -q -a -f name=$DOCKER_CONTAINER_NAME)" ]; then
  docker start "$DOCKER_CONTAINER_NAME"
  echo "Existing database container '$DOCKER_CONTAINER_NAME' started"
  exit 0
fi

docker start -d -e POSTGRES_PASSWORD=$DB_PASSWORD -p 5432:5432 --name $DOCKER_CONTAINER_NAME postgres