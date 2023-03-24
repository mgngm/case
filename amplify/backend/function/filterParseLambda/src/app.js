'use strict';
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// lambda/filterParse/app.ts
var app_exports = {};
__export(app_exports, {
  default: () => app_default,
});
module.exports = __toCommonJS(app_exports);
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});
app.get('/item', function (req, res) {
  res.json({ success: 'get call succeed!', url: req.url });
});
app.post('/filter-parse', function (req, res) {
  res.json({ success: 'post call succeed!', url: req.url, body: req.body });
});
app.post('/filter-parse/', function (req, res) {
  res.json({ success: 'post call succeed!', url: req.url, body: req.body });
});
app.listen(3e3, function () {
  console.log('App started');
});
var app_default = app;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=app.js.map
