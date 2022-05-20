const notEmpty = function (str) {
  return str !== null && str !== undefined && str.trim().length > 0;
};

module.exports = new function () {//функция построитель объекта - конструктор
  this.init = (app, categoryModel, productModel) => {//this ссылка на объект, который создаём (которой создаёт new)
    app.get('/', (req, res) => {
      res.redirect('index.html');
    });

    app.get('/index.html', async (req, res) => {
      try {
        let productData = await productModel.readAll();
        let categoryData = await categoryModel.readAll();

        let newArr = productData.map((x) => {
          x.category = categoryData.find((t) => x.catigory_id == t.id)
          return x;
        });

        res.render('index', { message: 'Список авторов', categories: categoryData, products: newArr });
      } catch (err) {
        res.status(500).send('Ошика работы с базой данных');
        console.log('Ошика работы с базой данных', err);
      }
    });

    app.get('/editCategory.html', async (req, res) => {
      try {
        let categoryData = await categoryModel.readAll();
        res.render('editCategory', { message: 'Список авторов', categories: categoryData });
      } catch (err) {
        res.status(500).send('Ошика работы с базой данных');
        console.log('Ошика работы с базой данных', err);
      }
    });

    app.get('/editCategoryById.html', async (req, res) => {
      try {
        let categoryData = await categoryModel.read(req.query.id);
        let msg = 'Редактирование автора';
        if (categoryData === null) {
          categoryData = { name: '' };
          msg = 'Добавление автора';
        }
        res.render('editCategoryById', { message: msg, category: categoryData });
      } catch (err) {
        res.status(500).send('Ошика работы с базой данных');
        console.log('Ошика работы с базой данных', err);
      }
    });

    app.post('/saveCategory.html', async (req, res) => {
      if (notEmpty(req.body.name)) {
        try {
          await categoryModel.save(req.body);
          res.redirect('editCategory.html');
        } catch (err) {
          res.status(500).send('Ошика работы с базой данных');
          console.log('Ошика работы с базой данных', err);
        }
      } else {
        res.status(400).send('Не переданы необходимые данные');
      }
    });

    app.post('/deleteCategory.html', async (req, res) => {
      try {
        await categoryModel.delete(req.body.id);
        res.redirect('editCategory.html');
      } catch (err) {
        res.status(500).send('Ошика работы с базой данных');
        console.log('Ошика работы с базой данных', err);
      }
    });
  };
};
