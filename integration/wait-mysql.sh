#!/usr/bin/env bash

waitInit () {
	echo "Waiting until PostgreSQL init ...";
	until docker-compose logs --tail=100 "$1" | grep "database system is ready to accept connections" > /dev/null; do
     	sleep 1
  done;
}

waitHealthy () {
	echo "Waiting until PostgreSQL is healthy ...";
	until docker-compose ps "$1" | grep "(healthy)" > /dev/null; do
    	sleep 1
  done;
}

waitInit $1
waitHealthy $1