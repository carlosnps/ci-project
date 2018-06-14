# Webpack Build Tool

This package will guide you through setting up your project's working enviroment. It uses [Webpack](https://webpack.js.org/) to compile your JavaScript and SCSS files. As part of the setup, it will download the 
[S360 Fundamental Toolkit](https://bitbucket.org/sq360_sysadmin/s360-fundamental-toolkit), which include several common libraries and SCSS variables. Please take a moment to check out that repo's `README.md` file to see what's included.

## Table of Contents

1. [Prerequisites](#markdown-header-prerequisites)
2. [Installation](#markdown-header-installation)
3. [Setup](#markdown-header-setup)
	+ [Project](#markdown-header-project)
	+ [Browsersync](#markdown-header-browsersync)
	+ [Drupal](#markdown-header-drupal)
4. [Usage](#markdown-header-usage)
	+ [Production Build](#markdown-header-production-build)
	+ [Watch for Changes](#markdown-header-watch-for-changes)
	+ [Recompile Source](#markdown-header-recompile-source)

---

## Prerequisites

The following package is needed before you can scaffold your package.

+ [NodeJS](https://nodejs.org/en/download/)

---

## Installation

Navigate to your projects root folder. If you're using a CMS like Drupal or Wordpress, navigate to the theme's root folder.

Run the _**EXACT**_ commands below.

```bash
git clone git@bitbucket.org:sq360_sysadmin/base-project-setup.git assets
```
```bash
cd assets
```
```bash
npm install
```

---

## Setup

There are several setup scripts which customize how this package defines your project. They are seperated by task, so if there's something you don't need or have no use for, you can ignore that script.

### **Project**

_**REQUIRED**_

Before you can start working on your project, there is a brief setup process you have to do first. The following command will guide you though setting up your project, installing optional 3rd party libraries and downloading the required dependenices you will need to compile your JavaScript and SCSS files.

```bash
npm run setup:project
```

After this step is complete that script will be removed from the `package.json` file and replaced with [Usage](#markdown-header-usage) scripts.

### **Browsersync**

If you want to have the browser automatically reload when you make a change to a JavaScript, SCSS or markup files, 


After you complete this setup, it will generate a file called **`local.browsersync.config`** inside the _`config/webpack/plugins`_ directory. 

**NOTE:** You need to add that file to your .gitignore file.  


```bash
npm run setup:browsersync
```

### **Drupal**

TODO

---

## Usage

After the project setup is complete, 3 webpack scripts become available for compiling.

### **Production Build**

The following command will minify, uglify and strip all code comments from the compiled JavaScript and CSS files. This creates smaller files, making them ready for production. It also creates performant source map files. Primarily this should used once your development is complete and you're ready for production.

**NOTE:** This process runs once then terminates.

```bash
npm run webpack:build
```

### **Watch for Changes**

The following command continually watches for changes to source files and automatically compilies them. It does not minify, uglify or strip code comments. This creates larger files, which aren't good for production. Primarily this should used during the development phase.

If [Browsersync](#markdown-header-browsersync) is configured, the browser will automatically reload.

**NOTE:** This process will always run until terminated.

```bash
npm run webpack:watch
```

### **Recompile Source**

The following command will compile your source files once. It also does not minify, uglify or strip code comments. Primarily this should be used when you merge GIT branches as the compiled files might be out of sync from the source files. 

**NOTE:** This process runs once then terminates.

```bash
npm run webpack:recompile
```