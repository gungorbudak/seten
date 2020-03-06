# Seten (web interface)

A tool for systematic identification and comparison of processes, phenotypes and diseases associated with RNA-binding proteins from condition-specific CLIP-seq profiles

## Production server

Seten's production server is running on https://sysbio.sitehost.iu.edu/seten/.

## Development server

### Requirements

* Node.js version 5.x

        # remove if an old version was installed
        # sudo apt-get remove nodejs
        curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
        sudo apt-get install -y nodejs

* Node Package Manager (NPM) latest version

        sudo apt-get install npm
        sudo npm install -g npm # upgrades itself to the latest version

### Setup

    git clone https://github.com/gungorbudak/seten.git
    cd seten/
    # download and untar the resources (around 300 MB)
    wget https://sysbio.sitehost.iu.edu/seten/assets/resources.tar.gz
    tar xzf resources.tar.gz -C assets/ && rm resources.tar.gz
    npm install --production
    npm start

After the server setup, Seten will run on `http://localhost:3000`

### Modification

The source code files is under `assets/js/src/`. After installing development dependencies, you can modify and live test them or bundle them for production. Run following commands to install dependencies:

    npm install --dev

#### Live test

Live test uses `webpack-dev-server` that tracks changes in the source code files in `assets/js/src/` and updates the pages automatically. Run following command to start it:

    npm run devel

#### Bundling for production

You can then bundle source code files inside `assets/js/build/` for production.

    npm run bundle

#### Switching between two in index.html

For live test, you should be using unminified version of the bundle, `assets/js/build/bundle.js` in `index.html`. After bundling for production, the minified version `assets/js/build/bundle.min.js` should be used.

## Tutorial

A tutorial that can guide you through Seten's features can be found on https://sysbio.sitehost.iu.edu/seten/tutorial.html

## Documentation

Seten's documentation can be found on https://sysbio.sitehost.iu.edu/seten/docs.html

## Command line interface

For those who would like to run Seten in command line, there is a Python version of the same implementation that can be found on https://github.com/gungorbudak/seten-cli
