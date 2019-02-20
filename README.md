
# Sprova Server 

[![Build Status](https://travis-ci.org/aldialimucaj/sprova-server.svg?branch=master)](https://travis-ci.org/aldialimucaj/sprova-server)


## API documentation
You can find the full list of public REST API calls https://aldialimucaj.github.io/sprova-server/ 

## Getting Started
Start the docker container with following parameters:

```docker run -d -e JWT_SECRET=secret_jwt_key -v ./myconfig:/server/config -p 8181:8181 --name sprova-server mjeshtri/sprova-server```

In your ./myconfig folder there should be a production.json file that has following format

```
{
    "logLevel": "warn",
    "db": {
        "host": "mongodb",
        "port": 27017,
        "name": "sprova"
    },
    "mongo": {
        "reconnectTries": 60,
        "reconnectInterval": 1000,
        "autoReconnect": true,
        "useNewUrlParser": true,
        "auth": {
            "user": "sprova",
            "password": "sprova"
        }
    }
}
```

### DB

Create mongo container with authentaction

```sudo docker run -p 27017:27017 --name mongo -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo```

Create new user with credentials for sprova server

```sudo docker run -it --rm --link mongo:mongo mongo mongo --host mongo -u mongoadmin -p secret --authenticationDatabase admin sprova --eval "db.createUser({user:'sprova', pwd:'sprova', roles:[{role:'readWrite',db:'sprova', passwordDigestor: 'server'}]});"```

