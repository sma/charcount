publish:
	node_modules/.bin/tsc
	cp app.ts app.js app.js.map index.html style.css /tmp
	git checkout gh-pages
	mv /tmp/app.ts .
	mv /tmp/app.js .
	mv /tmp/app.js.map .
	mv /tmp/index.html .
	mv /tmp/style.css . 
	git add .
	git commit -m "next version"
	git push origin gh-pages
	git checkout master

setup-site:
	git checkout --orphan gh-pages
	git rm -f README.md gulpfile.js package.json tsconfig.json tutorial.md Makefile
	echo >.gitignore node_modules/
	git add .
	git commit -m "initial version"
	git push origin gh-pages
	git checkout master
