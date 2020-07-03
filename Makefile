build:
	node_modules/.bin/react-scripts build
	rm -f app/index-v*
	node update-app-html.js
	mkdir -p app/static
	mkdir -p app/static/js
	mkdir -p app/static/css
	rm -f app/static/js/*.js
	cp build/static/js/*.js app/static/js
	cp build/static/js/*.js.map app/static/js
	rm -f app/static/css/*.css
	cp build/static/css/*.css app/static/css
	npx zet pack

.PHONY: build
