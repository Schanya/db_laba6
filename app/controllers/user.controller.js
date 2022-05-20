const clientModel = require("../models/client.model");
const userRoleModel = require("../models/user-role.module");
const roleModel = require("../models/role.model");
const phoneModel = require("../models/phone.model");
const addressModel = require("../models/address.model");

const notEmpty = function (str) {
    return str !== null && str !== undefined && str.trim().length > 0;
};

module.exports = new function () {//функция построитель объекта - конструктор
    this.init = (app, userModel) => {//this ссылка на объект, который создаём (которой создаёт new)
        app.get('/', (req, res) => {
            res.redirect('users.html');
        });

        app.get('/users.html', async (req, res) => {
            try {

                let userRoleData = await userRoleModel.readAll();
                let userData = await userModel.readAll();
                let clientData = await clientModel.readAll();
                let roleData = await roleModel.readAll();
                let phoneData = await phoneModel.readAll();
                let addressData = await addressModel.readAll();

                let usersInfo = userData.map((x) => {
                    x.client = clientData.find((t) => x.id == t.id)
                    x.role = userRoleData.find((t) => x.id == t.user_id)
                    x.role.name = roleData.find((t) => x.role.role_id == t.id).name
                    x.phone = phoneData.find((t) => x.client === undefined ? null : x.client.id == t.cleint_id)
                    x.address = addressData.find((t) => x.client === undefined ? null : x.client.id == t.cleint_id)
                    return x;
                })

                res.render('users', { message: 'Список пользователей', users: usersInfo });
            } catch (err) {
                res.status(500).send('Ошика работы с базой данных');
                console.log('Ошика работы с базой данных', err);
            }
        });

        app.get('/editUser.html', async (req, res) => {
            try {
                let userData = await userModel.read(req.query.id);
                let msg = 'Редактирование автора';
                if (userData === null) {
                    userData = { name: '' };
                    msg = 'Добавление автора';
                }
                res.render('editUser', { message: msg, user: userData });
            } catch (err) {
                res.status(500).send('Ошика работы с базой данных');
                console.log('Ошика работы с базой данных', err);
            }
        });

        app.post('/saveUser.html', async (req, res) => {
            if (notEmpty(req.body.name)) {
                try {
                    await userModel.save(req.body);
                    res.redirect('editUser.html');
                } catch (err) {
                    res.status(500).send('Ошика работы с базой данных');
                    console.log('Ошика работы с базой данных', err);
                }
            } else {
                res.status(400).send('Не переданы необходимые данные');
            }
        });

        app.post('/deleteUser.html', async (req, res) => {
            try {
                await userModel.delete(req.body.id);
                res.redirect('editUser.html');
            } catch (err) {
                res.status(500).send('Ошика работы с базой данных');
                console.log('Ошика работы с базой данных', err);
            }
        });
    };
};
