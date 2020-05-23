build:
	node_modules/.bin/react-scripts build
	node update-app-html.js
	rm -f app/static/js/*.js
	cp build/static/js/*.js app/static/js
	cp build/static/js/*.js.map app/static/js
	rm -f app/static/css/*.css
	cp build/static/css/*.css app/static/css
	cp build/*.css app
	npx zet pack

.PHONY: build
