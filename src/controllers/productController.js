const fs = require('fs');
const path = require('path');

const bcrypt = require('bcrypt');

const productsFilePath = path.join(__dirname, '../data/product.json');

const db = require('../database/models');

const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');

const Categorias = db.Categorias;
const Productos = db.Productos;

