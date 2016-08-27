whoami := $(shell whoami)

migration-up:
	docker-compose run --rm node \
	npm run migrate

migration-down:
	docker-compose run --rm node ./node_modules/.bin/pg-migrate down

webpack-update:
	docker-compose run --rm node ./node_modules/.bin/webpack --progress

migration-create:
	docker-compose run --rm node ./node_modules/.bin/pg-migrate create $(name) && sudo chown -R ${whoami}:${whoami} migrations

install:
	docker-compose run --rm node npm install

npm-install-dep:
	docker-compose run --rm node npm install --save $(package) && sudo chown -R ${whoami}:${whoami} package.json

npm-install-devDep:
	docker-compose run --rm node npm install --save-dev $(package) && sudo chown -R ${whoami}:${whoami} package.json


build:
	docker build -t kannaj/42exp .

push: build
	docker push kannaj/42exp

tests:
	docker-compose -f docker-compose.test.yml up

development:
	docker-compose up

production:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

rebuild-node:
	docker-compose stop node && docker-compose rm -f node && docker-compose -f docker-compose.prod.yml up --no-deps --build -d node
