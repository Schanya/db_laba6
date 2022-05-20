const notEmpty = function (str) {
    return str !== null && str !== undefined && str.trim().length > 0;
};

module.exports = new function () {//функция построитель объекта - конструктор
    this.init = (app, productModel, categoryModel) => {//this ссылка на объект, который создаём (которой создаёт new)
        app.get('/', (req, res) => {
            res.redirect('index.html');
        });

        app.get('/products.html', async (req, res) => {
            try {
                let categoryData = await categoryModel.readAll();
                let productData = await productModel.readAll();

                let newArr = productData.map((x) => {
                    x.category = categoryData.find((t) => x.catigory_id == t.id)
                    return x;
                });

                res.render('products', { products: newArr, categories: categoryData });
            } catch (err) {
                res.status(500).send('Ошика работы с базой данных');
                console.log('Ошика работы с базой данных', err);
            }
        });

        app.get('/editProduct.html', async (req, res) => {
            try {
                let categoryData = await categoryModel.readAll();
                let productData = await productModel.read(req.query.id);
                let msg = 'Редактирование автора';
                if (productData === null) {
                    productData = { title: '', price: ' ', description: ' ', category_id: ' ' };
                    msg = 'Добавление автора';
                }
                res.render('editProduct', { message: msg, product: productData, categories: categoryData });
            } catch (err) {
                res.status(500).send('Ошика работы с базой данных');
                console.log('Ошика работы с базой данных', err);
            }
        });

        app.post('/saveProduct.html', async (req, res) => {

            if (notEmpty(req.body.title) && notEmpty(req.body.description) && notEmpty(req.body.catigory_id) && notEmpty(req.body.price)) {
                try {
                    await productModel.save(req.body);
                    res.redirect('index.html');
                } catch (err) {
                    res.status(500).send('Ошика работы с базой данных');
                    console.log('Ошика работы с базой данных', err);
                }
            } else {
                res.status(400).send('Не переданы необходимые данные');
            }
            //console.log(req);
        });

        app.post('/deleteProduct.html', async (req, res) => {
            try {
                await productModel.delete(req.body.id);
                res.redirect('index.html');
            } catch (err) {
                res.status(500).send('Ошика работы с базой данных');//исправить на понятные пользователю
                console.log('Ошика работы с базой данных', err);
            }
        });
    };
};
