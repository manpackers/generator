![npm](https://img.shields.io/npm/v/@manpacker/generator.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/@manpacker/generator.svg)
![npm](https://img.shields.io/npm/dw/@manpacker/generator.svg)
![NPM](https://img.shields.io/npm/l/@manpacker/generator.svg)
<br><br>
![nodei.co](https://nodei.co/npm/@manpacker/generator.png?downloads=true&downloadRank=true&stars=true)
<br>
# Explain
Manpacker is a set of build engine based on [webpack](https://www.webpackjs.com/) to build engine package.<br>
Entry file supported file extension <code>js</code> or <code>ts</code><br>
Support for multi-portal file build, Files must be in the build <code>root</code> directory.<br>
## .manpackeric
Project default initialization file, Can be a <code>javascript</code> script file, or a <code>json</code> configuration file.<br>
Example: json<br>
```
{"output": "view"}
```
You can also set the <code>manpacker</code> field in the <code>package.json</code> file.<br>
Example:<br>
```
{"manpacker": {"root": "src"}}
```
Final input result, Merge <code>.manpackeric</code> config item.
```
{"root": "src", "output": "view"}
```
You can customize the project initialization file name.<br>
Example:<br>
Custom name: development.ic.js
```
npx manpacker --ci development.ic.js
```
```
manpacker --ci development.ic.js
```
# Install
```
npm i @manpacker/generator -D
```
# Usage
## CLI
Start the local development environment.
```
manpacker server
```
```
manpacker server --ic [value] -c [config] --port [number]
```
Construction of production environment engineering project.
```
manpacker build
```
```
manpacker build --ic [value] -c [config]
```
## API
```
const manpacker = require('@manpacker/generator')
```
### method
#### .compile
Core compilation method
```
const { compile } = require('@manpacker/generator')
compile({ env, ic, config })
```

|param|type|explain|
|-----|----|-------|
|env|string|<code>env: NDOE_ENV variabl</code>|
|ic|object|<code>[.manpackeric](#.manpackeric)</code> config item object|
|config|function|<code>[manpacker.webpack.js](#manpacker.webpack.js)</code> return funtion|

#### .Commander
Commander is Create command-line class.
```
const { Commander } = require('@manpacker/generator')

let { version } = require('./package.json')
let commander = new Commander({ version })

```
Explain commander methods

|method|explain|
|------|-------|
|build|Default build production environment, enter project directory|
|server|Launch Development Environment, Local Interconnect Service, default Port 8090|
|parse|Compile registration command Lint|
#### .createCssLoader
Create css loader generator.
```
const { createCssLoader } = require('@manpacker/generator')
```
|param|type|explain|
|-----|----|-------|
|ic|object|code>.manpackeric</code> config item object|
|...loader|[object,string]|style loader|

Example:
```
createCssLoader(ic, { loader: 'resolve-url-loader' }, { loader: 'sass-loader' })
```
```
createCssLoader(ic, 'resolve-url-loader', 'sass-loader')
```
#### .createURILoader
Create URI file loader generator.

|param|teype|explain|
|-----|-----|-------|
|dir|string|create new dir for URI file.|

#### .createEslintLoader
Create Eslint loader generator.

|param|teype|explain|
|-----|-----|-------|
|rgx|RegExp|Create eslint loader.|

## .manpackeric
Default root file name: <code>.manpackeric</code><br>
Configuration item description:<br>

|name|type|value|description|
|----|----|-----|-----------|
|root|string|default: src| Source directory for building the project|
|output|string|default: view|Directory output after build|
|ext|string|default:htm|Extension of the outputted page|
|cdn|string|default: "/"|Domain name for static Resource, "publicPath" attribute value|
|define|object|dedalut: {NODE_ENV: process.env.NODE_ENV}|Define constants in a project, <code>eslintrc</code> set global key-value|
|pages|object|default: {}|Multi-portal file page configuration [Example](#pages)|
|remUnit|number|default: 100|Conversion of <code>px</code> with <code>750px</code> Design Diagram, Minimum cardinality.|
|isPx2rem|boolean|default:true|Pixel unit <code>px</code> conversion <code>rem</code>|
|injectStyle|array|default:[]|Global style files that need to be injected, Avoid repeating reference, [Example](#injectStyle)|
|isCssExtract|boolean|default: fasle|Extract css separate files|
|isMergeCommon|boolean|default:false|When multiple portal files are used, the common code section is extracted|
|minChunks|number|default: 2|If <code>isMergeCommon:true</code>, Extracts the minimum entry file number of files for the public code.|
|isCssModule|boolean|default:false|Whether styles are introduced as css templates, [Example](#isCssModule)|
|isMiniHTML|boolean|default:true|Compressed page.|
|template|string|default:'template.html'|Build-time template file.|
|map|string|default: ' '|Source map file URI|
|isEslint|boolean|default: true|Start the eslint-loader feature by default|
|isZip|boolean|default: false|Compressed project are zip’s ext. |
|proxy|object|default: {}|Resolve browser request interface joint cross-domain. |

### .pages
Ingress File header Settin.
Example:
Entry files <code>index.js</code>
```
{"page": {"index": "Test title"}}
```
More entry files <code>index.ts</code>、<code>list.ts</code>, and so on.
```
{"pages": {"index": "Test title", "list": "List test title"}}
```

### .injectStyle
Inject global style file, Avoid manual introduction<br>
Example:
```
{"injectStyle": ["./common/style/mixins.scss", "./common/style/varable.scss"]}
```
```
{"injectStyle": ["./common/style/index.scss"]}
```
### .isCssModule
Introduction of css style to work with Modular approach.<br>
Example: <br>
index.scss
```
.frame {margin: auto;}
```
index.jsx
```
import Style from './index.scss'

<div class={Style.frame}></div>
```
### .proxy

```
{
  '/api': {
    'target': 'https://maindomain.com',
    'changeOrigin': true,
    'secure': true,
    'pathRewrite': {
      '^/api': ''
    },
    'logLevel': 'debug'
  }
}
```
```
API: http://localhost:8090/api/home => https://maindomain.com/home
```

## postcss.config.js
Specific reference: [postcss](https://www.npmjs.com/package/postcss)

This generator includes plugins: <code>postcss-preset-env</code> <code>postcss-import</code> <code>postcss-url</code> <code>cssnano</code><br>
Extend the postcss plug-in the root directory: create file <code>postcss.config.js</code>

## manpacker.webpack.js
Default root file name: <code>manpacker.webpack.js</code>
```
module.exports = ic => {
  // webpack config item.
  return {}
}
```
The parameter <code>ic</code> is the injected initialization parameter object.<br>
Webpack configuration items can be set based on <code>ic</code>
## Npm
[link](https://www.npmjs.com/package/@manpacker/generator)
