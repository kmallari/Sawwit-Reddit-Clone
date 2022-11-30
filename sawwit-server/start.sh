# wait for db Docker to start up
: ${SLEEP_LENGTH:=2}
 
wait_for() {
 echo Waiting for $1 to listen on $2...
 while ! nc -z $1 $2; do echo sleeping; sleep $SLEEP_LENGTH; done
}
 
for var in "$@"
do
 host=${var%:*}
 port=${var#*:}
 wait_for $host $port
done

#!/bin/bash
 
# run create/update migration scripts
echo "create-if-not-exist database"
node ./node_modules/db-migrate/bin/db-migrate db:create ${DB_NAME} -e dev --config ./database/database.json
echo "finished create-if-not-exist database"
 
echo "update database"
node ./node_modules/db-migrate/bin/db-migrate up -e dev --config ./database/database.json -m ./database/migrations
echo "finished update database"
 
# run node app
echo "running node app"
npm start