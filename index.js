const port = 80;
//MVC
const express = require('express');
const app = express();//само web-приложение
app.use(require('body-parser').urlencoded({ extended: true }));//чтобы методом POST получать и отправлять данные
app.use(express.static('public'));//содержимое этой папки можно отдавать пользователю

const ect = require('ect');
const renderer = ect({
  watch: true,
  root: __dirname + '/views',
  ext: '.ect'
});
app.set('view engine', 'ect');
app.engine('ect', renderer.render);

const categoryModel = require('./app/models/category.model');
const productModel = require('./app/models/product.model');
const userModel = require('./app/models/user.module');
const orderModel = require('./app/models/order.module');

const categoryController = require('./app/controllers/category.controller');
categoryController.init(app, categoryModel, productModel);

const productController = require('./app/controllers/product.controller');
productController.init(app, productModel, categoryModel);

const userController = require('./app/controllers/user.controller');
userController.init(app, userModel);

const orderController = require('./app/controllers/order.controller');
orderController.init(app, orderModel);

app.listen(port, (err) => {
  console.log(`Server running at http://localhost:${port}/`);
});