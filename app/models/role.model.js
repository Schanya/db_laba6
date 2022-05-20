const pool = require('../dataBase/bd');

module.exports = new function () {
    this.readAll = async () => {
        return await this._operation('SELECT "id", "name" FROM "role"', null);
    };

    this.read = async (id) => {
        if (id) {
            let res = await this._operation('SELECT "id", "name" FROM "role" WHERE "id" = $1', [id]);
            return res ? res[0] : null;
        } else {
            return null;
        }
    };

    this.readByName = async (name) => {
        if (name) {
            let res = await this._operation('SELECT "id", "name" FROM "role" WHERE "name" = $1', [name]);
            return res ? res[0] : null;
        } else {
            return null;
        }
    };

    this.save = async (role) => {
        if (role.id !== undefined) {
            await this._operation(
                'UPDATE "role" SET  "name" = $1 WHERE "id" = $2',
                [role.name, role.id]
            );
        } else {
            await this._operation(
                'INSERT INTO "role" ("name") VALUES ($1)',
                [role.name]
            );
        }
    };

    this.delete = async (id) => {
        await this._operation('DELETE FROM "role" WHERE "id" = $1', [id]);
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
