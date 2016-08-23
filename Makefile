migration-up:
	docker-compose run --rm node \
	npm run migrate

migration-down:
	docker-compose run --rm node ./node_modules/.bin/pg-migrate down

webpack-update:
	docker-compose run --rm node ./node_modules/.bin/webpack --progress

migration-create:
	docker-compose run --rm node ./node_modules/.bin/pg-migrate create $(name)

install:
  docker-compose run --rm node npm install

npm-install-dep:
  docker-compose run --rm node npm install --save $(package)

npm-install-devDep:
	docker-compose run --rm node npm install --save-dev $(package)
