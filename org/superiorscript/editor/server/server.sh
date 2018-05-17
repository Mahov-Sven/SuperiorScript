node server.js &
NODE_SERVER=$!
mongod --dbpath ../../res/database &
MONGO_DATABASE=$!
wait $NODE_SERVER $MONGO_DATABASE
