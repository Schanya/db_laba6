const pool = require('../dataBase/bd');

module.exports = new function () {
    this.readAll = async () => {
        return await this._operation('SELECT "id", "number", "cleint_id" FROM "phone"', null);
    };

    this.read = async (id) => {
        if (id) {
            let res = await this._operation('SELECT "id", "number", "cleint_id" FROM "phone" WHERE "id" = $1', [id]);
            return res ? res[0] : null;
        } else {
            return null;
        }
    };

    this.save = async (phone) => {
        if (phone.id !== undefined) {
            await this._operation(
                'UPDATE "phone" SET  "number" = $1, "cleint_id" = $2 WHERE "id" = $3',
                [phone.number, phone.cleint_id, phone.id]
            );
        } else {
            await this._operation(
                'INSERT INTO "phone" ("number", "cleint_id") VALUES ($1, $2)',
                [phone.number, phone.cleint_id]
            );
        }
    };

    this.delete = async (id) => {
        await this._operation('DELETE FROM "phone" WHERE "id" = $1', [id]);
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
