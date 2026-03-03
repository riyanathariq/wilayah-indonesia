.PHONY: install run deploy

install:
	npm install

run:
	npm run build

deploy: run
	npx gh-pages -d dist
