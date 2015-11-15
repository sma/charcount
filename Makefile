publish:
	git checkout gh-pages
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
