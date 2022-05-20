const pool = require('../dataBase/bd');

module.exports = new function () {
    this.readAll = async () => {
        return await this._operation('SELECT "id", "login", "password" FROM "user"', null);
    };

    this.read = async (id) => {
        if (id) {
            let res = await this._operation('SELECT "id", "login", "password" FROM "user" WHERE "id" = $1', [id]);
            return res ? res[0] : null;
        } else {
            return null;
        }
    };

    this.save = async (user) => {
        if (user.id !== undefined) {
            await this._operation(
                'UPDATE "user" SET  "login" = $1, "password" = $2 WHERE "id" = $3',
                [user.login, user.password, user.id]
            );
        } else {
            await this._operation(
                'INSERT INTO "user" ("login", "password") VALUES ($1, $2)',
                [user.login, user.password]
            );
        }
    };

    this.delete = async (id) => {
        await this._operation('DELETE FROM "user" WHERE "id" = $1', [id]);
    };

    this._operation = async (sql, data) => {
        let client = await pool.connect();
        try {
            let res = await client.query(sql, data);
            return res ? res.rows : undefined;
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    };
};
