const pool = require('../dataBase/bd');

module.exports = new function () {
    this.readAll = async () => {
        return await this._operation('SELECT "id", "name", "surname" FROM "cleint"', null);
    };

    this.read = async (id) => {
        if (id) {
            let res = await this._operation('SELECT "id", "name", "surname" FROM "cleint" WHERE "id" = $1', [id]);
            return res ? res[0] : null;
        } else {
            return null;
        }
    };

    this.save = async (client) => {
        if (client.id !== undefined) {
            await this._operation(
                'UPDATE "cleint" SET  "name" = $1, "surname" = $2 WHERE "id" = $3',
                [client.name, client.surname, client.id]
            );
        } else {
            await this._operation(
                'INSERT INTO "cleint" ("name", "surname") VALUES ($1, $2)',
                [client.name, client.surname]
            );
        }
    };

    this.delete = async (id) => {
        await this._operation('DELETE FROM "cleint" WHERE "id" = $1', [id]);
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
