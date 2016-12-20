Setup eines SPA-Projekts mit TypeScript
=======================================

Die folgenden Schritte sind notwendig, um ein Projekt aufzusetzen, das eine _Single Page Application_ (SPA) in Form einer HTML-Seite erzeugt, das die eingegebenen Zeichen (ohne Leerzeichen) in einem Textfeld zählen kann. Ich nenne mein Projekt `charcount`. Ich werde es mit TypeScript implementieren.

Ohne [Node.js](https://nodejs.org/en/) (aktuell 5.0.0) geht gar nichts:

    $ brew install node

Außerdem benutze ich [Git](https://git-scm.com/) (aktuell 2.6.3):

    $ brew install git

Ich erzeuge ein neues Projektverzeichnis:

    $ mkdir charcount
    $ cd charcount

Ich erzeuge dort ein Git-Repo, um später alles auf Github zu deployen:

    $ git init

Ich benötige eine `.gitignore`-Datei, die sagt, welche Dateien ich nicht mit Git verwalten möchte, weil sie im Laufe des Projekts erzeugt werden. Aktuell sind es ein Verzeichnis und zwei Dateien. Diese Datei muss jeweils angepasst werden, wenn sich das ändert (das `^D` steht für Ctrl+D, was eingegeben werden muss, um `cat` zu beenden):

```
$ cat >.gitignore
node_modules/
app.js
app.js.map
^D
```

Ich erzeuge eine (vorerst minimale `README.md`-Datei, die Github automatisch als Beschreibung des Projekts anzeigt und die `npm` anmahnt, wenn sie nicht existiert (das `^D` steht für Ctrl+D, was eingegeben werden muss, um `cat` zu beenden):

```
$ cat >README.md
Charcount
=========
A tiny SPA to count non-whitespace characters.
^D
```

Ich lege ein `npm`-Projekt an:

    $ npm init

Ich muss den Namen `charcount` mit RETURN bestätigen, und kann bis zum Autor einfach jeweils mit RETURN den Vorschlag übernehmen. Als Autor trage ich `Stefan` ein, als Lizenz `MIT` (hauptsächlich, weil das kurz ist) und bestätige die erstellte Datei `package.json` dann noch einmal mit RETURN.

Danach bearbeite ich die Datei (z.B. mit `vi`), damit sie so aussieht:

```js
{
    "name": "charcount",
    "version": "1.0.0",
    "description": "A tiny SPA to count non-whitespace characters.",
    "scripts": {
    },
    "author": "Stefan",
    "license": "MIT"
}
```

Ich möchte [Gulp](http://gulpjs.com/) benutzen, um das Bauen meines Projekts zu automatisieren. Dazu installiere ich das Tool als _development dependency_ mittels `npm`:

    $ npm install gulp --save-dev

Dies fügt `gulp` (aktuell 3.9.0) der `package.json`-Datei hinzu:

```js
{
    ...
    "devDependencies": {
        "gulp": "^3.9.0"
    }
}
```

Dies wiederhole ich für [TypeScript](http://www.typescriptlang.org/) und [Browser-Sync](http://www.browsersync.io/), ein Tool, das ich benutzen will, damit ich Änderungen an HTML oder CSS-Dateien sofort im Browser sehe, was ungemein praktisch ist.

    $ npm install gulp-typescript --save-dev
    $ npm install browser-sync --save-dev

Dies alles installiert eine Unzahl von Dateien in `node_modules`. Dieses Verzeichnis hatte ich ja bereits in `.gitignore` ignoriert. Das gesamte Setup lässt sich nun mit einem einzigen Befehl wiederholen: `npm install`. Ich möchte das in `README.md` dokumentieren:

```
Charcount
=========
A tiny SPA to count non-whitespace characters.

To setup, run `npm install`.
```

Als nächstes benötige ich eine Konfigurationsdatei für TypeScript, die `tsconfig.json` heißen muss. Sie definiert, dass ich ES2015-kompatiblen Code erzeugen und dabei `app.ts` in `app.js` übersetzen will (das `^D` steht für Ctrl+D, was eingegeben werden muss, um `cat` zu beenden):

```js
$ cat >tsconfig.json
{
    "compilerOptions": {
        "module": "commonjs",
        "out": "app.js",
        "sourceMap": true,
        "target": "ES5"
    },
    "files": [
        "app.ts"
    ]
}
^D
```

Jedes Mal, wenn ich eine weitere TypeScript-Datei benutzen will, muss ich sie dummerweise unterhalb von `"files"` hinzufügen. Das ist unbequem, aber notwendig, um z.B. [_Visual Studio Code_](https://code.visualstudio.com/) für die Entwicklung zu benutzen.

Ich kann schon einmal die Dateien anlegen, um die es mir überhaupt geht:

    $ touch index.html style.css app.ts

Als letzten Schritt benötige ich nun die Anweisungen für Gulp, in Form einer nicht-trivialen JavaScript-Datei:

```js
var gulp = require('gulp');
var bs = require('browser-sync');
var ts = require('gulp-typescript');

gulp.task('typescript', function () {
    var project = ts.createProject('tsconfig.json');
    var result = project.src().pipe(ts(project));
    return result.js
        .pipe(gulp.dest('.'))
        .pipe(bs.reload({stream: true}));
});

gulp.task('browser-sync', function () {
    bs.init(null, {
        files: ['*.css', '*.html'],
        server: {
            baseDir: '.'
        }
    });
});

gulp.task('default', ['typescript', 'browser-sync'], function () {
    gulp.watch('*.ts', ['typescript']);
});
```

Zunächst importiert dies die Abhänigkeiten, insbesondere `browser-sync` und `gulp-typescript`. Dann definiere ich die Aufgaben (`gulp.task` genannt), die Gulp für mich durchführen können soll:

- Würde ich `gulp typescript` per Kommandozeile aufrufen, wird die eben definierte `tsconfig.json`-Datei eingelesen und alle dort vereinbarten Quelldateien werden übersetzt und zurück ins aktuelle Verzeichnis geschrieben (ich bin mir nicht 100% sicher, ob das die `"out"`-Deklaration in `tsconfig.json` überschreibt oder diese dazu führt, dass dieser Teil im Gulp-Task ignoriert wird, es klappt jedenfalls so. Als letzter Schritt wird Browser-Sync gesagt, es soll die Seite neu laden (das `{stream: true}` habe ich einfach abgeschrieben und kann es nicht erklären).

- Würde ich `gulp browser-sync` per Kommandozeile aufrufen, würde ein Server (auf <http://localhost:3000>) starten, der alle css- und html-Dateien im aktuellen Verzeichnis überwacht und den Standard-Browser (bei mir ist das Google Chrome) mit `index.html` öffnet.

- Der `default`-Task wird gestartet, wenn ich `gulp` in der Kommandozeile ohne weiteren Parameter aufrufe. In diesem Fall wird zunächst `typescript` und dann `browser-sync` aufgerufen und danach jede ts-Datei überwacht und bei Änderungen immer wieder der `typescript`-Task durchgeführt, um alle Dateien neu zu übersetzen und einen Reload der Seite auszulösen.

So kann ich `gulp` starten:

    $ node_modules/.bin/gulp

Um das zu vereinfachen, trage ich (z.B: mit `vi`) den Aufruf in `packages.json` als `start`-Script ein (diese suchen automatisch in `node_modules/.bin` nach ausführbaren Programmen). Dann kann ich zukünftig einfach `npm run start` oder `npm start` eingeben. Das sollte ich auch noch in `README.md` dokumentieren.

```js
{
    ...
    "scripts": {
        "start": "gulp"
    },
    ...
}
```

Die Konfiguration ist abgeschlossen, und ich kann die SPA schreiben.

Hier ist eine minimale Version:

### index.html
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="style.css">
        <script src="app.js"></script>
    </head>
    <body>
        <h1>Zeichenzähler</h1>
        <textarea id="text" placeholder="Text" rows="12" cols="50"></textarea>
        <p>Anzahl der Zeichen: <b id="count">0</b></p>
    </body>
</html>
```

### style.css
```css
body {
    font-family: sans-serif;
    font-size: 16px;
    line-height: 22px;
}
textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}
```

### app.ts
```js
function ready(f: EventListener) {
    document.addEventListener("DOMContentLoaded", f);
}

function countCharacters(s: string): number {
    return s ? s.replace(/\s+/g, '').length : 0; 
}

ready(() => {
    var text = <HTMLTextAreaElement> document.getElementById("text");
    var count = <HTMLSpanElement> document.getElementById("count");
    
    text.addEventListener("input", () => { 
        count.textContent = String(countCharacters(text.value));
    });
});
```

Damit ist die App fertig.

Wir können sie mit `git` einchecken und dann zu [Github](https://github.com/) (oder jedem beliebigen anderen Service) hochladen und mit der Welt teilen. Dabei sind `<user>` und `<repo>` natürlich passend zu setzen. Wahrscheinlich sollten wir noch `README.md` um die Lizenzklausel für MIT ergänzen.  

    $ git add .
    $ git commit -m "initial version"
    $ git remote add origin https://github.com/<user>/<repo>.git
    $ git push origin master

Eine letzte Sache noch: Bei Github kann man für jedes Projekt auch eine Website erzeugen, die Github netterweise hostet. Ich möchte daher die fertige App auf diese Weise deployen. Dazu habe ich mir das folgende `Makefile` erstellt, dass ich dann einmalig mit `make setup-site` und später einfach nur noch mit `make` aufrufe:

```sh
publish:
    git checkout gh-pages
    git add .
    git commit -m "next version"
    git push origin gh-pages
    git checkout master

setup-site:
    git checkout --orphan gh-pages
    git rm -f README.md gulpfile.js package.json tsconfig.json Makefile
    echo >.gitignore node_modules/
    git add .
    git commit -m "initial version"
    git push origin gh-pages
    git checkout master
```

Das Ziel `setup-site` legt einen neuen _branch_ namens `gh-pages` an, in dem ich alles bis auf die notwendigen Dateien lösche, inklusive dem Script selbst, das aber glücklicherweise weiterläuft. Ich passe `.gitignore` an damit nicht mehr `app.js` ignoriert wird, dann publiziere ich den neuen Branch bei Github Pages und wechsle zurück zum `master`-_branch_.

Bevor ich `make setup-site` aufrufen kann, muss ich `Makefile` aber erst einmal im `master`-_Branch_ einchecken, um die Datei nicht sofort wieder zu verlieren.

Die SPA ist nun unter `<user>.github.io/<repo>/` verfügbar.

Das war's.
