# Seten (browser user interface)

A tool for systematic identification and comparison of processes, phenotypes and diseases associated with RNA-binding proteins from condition-specific CLIP-seq profiles

## Production server

Seten's production server is running on http://www.iupui.edu/~sysbio/seten/

## Development server

### Setup

    git clone https://github.com/gungorbudak/seten.git
    cd seten/
    wget http://www.iupui.edu/~sysbio/seten/assets/resources.zip
    unzip resources.zip -d assets/ && rm resources.zip
    npm run server

After the server setup, Seten will run on `http://localhost:3000`

### Modification

You can modify the source file `assets/js/src/app.js` (easier) or the translated file `assets/js/build/app.js`. If you use the source file, you need to translate it to plain JavaScript file under `assets/js/build/`.

Install the development packages once using Node Package Manager.

    npm install --dev

Use Babel for translation (note any modification will be monitored and the source file will be autotranslated).

    npm run dev

## Tutorial

A tutorial that can guide you through Seten's features can be found on http://www.iupui.edu/~sysbio/seten/tutorial.html

## Documentation

Seten's documentation can be found on http://www.iupui.edu/~sysbio/seten/docs.html

## Command line interface

For those who would like to run Seten in command line, there is a Python version of the same implementation that can be found on https://github.com/gungorbudak/seten-cli
