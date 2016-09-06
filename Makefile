copwhoami := $(shell whoami)

migration-up:
	docker-compose run --rm --no-deps  web \
	npm run migrate

migration-down:
	docker-compose run --rm --no-deps web ./node_modules/.bin/pg-migrate down

webpack-update:
	docker-compose run --rm --no-deps web ./node_modules/.bin/webpack --progress

migration-create:
	docker-compose run --rm --no-deps web ./node_modules/.bin/pg-migrate create $(name) && sudo chown -R ${whoami}:${whoami} migrations

install:
	docker-compose run --rm --no-deps web npm install

npm-install-dep:
	docker-compose run --rm --no-deps web npm install --save $(package) && sudo chown -R ${whoami}:${whoami} package.json

npm-install-devDep:
	docker-compose run --rm --no-deps web npm install --save-dev $(package) && sudo chown -R ${whoami}:${whoami} package.json


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

rebuild-web:
	docker-compose stop web && docker-compose rm -f web && docker-compose -f docker-compose.prod.yml up --no-deps --build -d web


ansible-install:
	ansible-galaxy install -r devops/requirements.yml -p devops/roles

ansible-provision:
	ansible-playbook devops/provisioning.yml -i devops/hosts/ --ask-become-pass

ansible-start:
	ansible-playbook devops/start-application.yml -i devops/hosts/ --ask-become-pass

ansible-deploy: push
	ansible-playbook devops/deploy.yml -i devops/hosts/ --ask-become-pass
