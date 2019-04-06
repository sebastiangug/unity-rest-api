"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const statusController = require("./controllers/status");
const app = express();
app.set('port', process.env.PORT || 8080);
app.get('/', statusController.hi);
app.post('/awesome', statusController.awesome);
exports.default = app;
//# sourceMappingURL=app.js.map