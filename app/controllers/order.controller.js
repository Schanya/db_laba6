const clientModel = require('../models/client.model');

const notEmpty = function (str) {
    return str !== null && str !== undefined && str.trim().length > 0;
};

module.exports = new function () {//функция построитель объекта - конструктор
    this.init = (app, orderModel) => {//this ссылка на объект, который создаём (которой создаёт new)
        app.get('/', (req, res) => {
            res.redirect('order.html');
        });

        app.get('/clientsOrder.html', async (req, res) => {
            try {
                let orderData = await orderModel.readByClient(req.query.id);
                let clientData = await clientModel.read(req.query.id);

                let orderInfo = orderData.map((x) => {
                    x.client = clientData.find((t) => x.cleint_id == t.id)
                    return x;
                });

                res.render('clientsOrder', { orders: orderInfo });
            } catch (err) {
                res.status(500).send('Ошика работы с базой данных');
                console.log('Ошика работы с базой данных', err);
            }
        })

        app.get('/orders.html', async (req, res) => {
            try {
                let clientData = await clientModel.readAll();
                let orderData = await orderModel.readAll();

                let orderInfo = orderData.map((x) => {
                    x.cleint = clientData.find((t) => x.cleint_id == t.id)
                    return x;
                });

                res.render('orders', { orders: orderInfo });
            } catch (err) {
                res.status(500).send('Ошика работы с базой данных');
                console.log('Ошика работы с базой данных', err);
            }
        });

        app.get('/editOrder.html', async (req, res) => {
            try {
                let orderData = await orderModel.read(req.query.id);
                let msg = 'Редактирование автора';
                if (orderData === null) {
                    orderData = { order_date: '', total_cost: ' ', cleint_id: ' ', managDecision: ' ', status_id: ' ' };
                    msg = 'Добавление автора';
                }
                res.render('editOrder', { message: msg, order: orderData });
            } catch (err) {
                res.status(500).send('Ошика работы с базой данных');
                console.log('Ошика работы с базой данных', err);
            }
        });

        app.post('/saveOrder.html', async (req, res) => {

            if (notEmpty(req.body.order_date) && notEmpty(req.body.total_cost) && notEmpty(req.body.cleint_id) && notEmpty(req.body.managDecision) && notEmpty(req.body.status_id)) {
                try {
                    await orderModel.save(req.body);
                    res.redirect('order.html');
                } catch (err) {
                    res.status(500).send('Ошика работы с базой данных');
                    console.log('Ошика работы с базой данных', err);
                }
            } else {
                res.status(400).send('Не переданы необходимые данные');
            }

        });

        app.post('/deleteOrder.html', async (req, res) => {
            try {
                await orderModel.delete(req.body.id);
                res.redirect('order.html');
            } catch (err) {
                res.status(500).send('Ошика работы с базой данных');//исправить на понятные пользователю
                console.log('Ошика работы с базой данных', err);
            }
        });
    };
};
