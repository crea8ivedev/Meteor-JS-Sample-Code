Meteor App
===================

Development Server
------------------

The startup script is in package.json, which is the main configuration file. To start the development server install meteor on your system then clone this repo. Make sure to install all NPM modules first, then start the development server with the npm start script:

```
$ meteor npm i
$ meteor npm start
```

NPM Build requirements
----------------------

We use a number of npm packages, and one in particular (`bcrypt`) requires some [build tools installed on your system](https://github.com/kelektiv/node.bcrypt.js/wiki/Installation-Instructions#ubuntu-and-derivatives---elementary-linux-mint-etc). Here are the three main supported systems and how to get the build tools installed.

macOS
-----

It should just work. If you get errors installing bcrypt on macOS, you may need may need to install XCode.

Windows
-------

NOTE: It is recommended to use WSL2 for development on Windows, ideally, from within the WSL user folder (`cd ~`) on the virtual disk. If you use VS Code as your editor, once WSL2 and VS Code are installed, you can open VS Code in a special remote mode by running `code .` at the WSL2 prompt in your project directory.

To run on Windows, install node.js/npm and `windows-build-tools` npm package globally. Meteor will still use the embedded copy of node.js, but it requires some of the dependencies from the `windows-build-tools` package to be installed, and this is the easiest way to get those deps.

```npm install --global --production windows-build-tools```

Another thing to be aware of on Windows, is that Windows Defender can make the rebuild process of Meteor quite slow. You can work around that temporarily by disabling real time protection. You may alternatively wish to add some exclusions. Add one for the project directory, and another for Meteor core, which on windows is located at: `C:\Users\{your-user-name}\AppData\Local\.meteor`.

Ubuntu (and Debian or anything with apt-get - including WSL2)
-------------------------------------------------------------

Install Python build tools with aptitude:

```sudo apt-get install -y build-essential python```
