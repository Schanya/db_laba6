const pool = require('../dataBase/bd');

module.exports = new function () {
    this.readAll = async () => {
        return await this._operation('SELECT "id", "address_name", "cleint_id" FROM "address"', null);
    };

    this.read = async (id) => {
        if (id) {
            let res = await this._operation('SELECT "id", "address_name", "cleint_id" FROM "address" WHERE "id" = $1', [id]);
            return res ? res[0] : null;
        } else {
            return null;
        }
    };

    this.save = async (address) => {
        if (address.id !== undefined) {
            await this._operation(
                'UPDATE "address" SET  "address_name" = $1, "cleint_id" = $2 WHERE "id" = $3',
                [address.address_name, address.cleint_id, address.id]
            );
        } else {
            await this._operation(
                'INSERT INTO "address" ("address_name", "cleint_id") VALUES ($1, $2)',
                [address.address_name, address.cleint_id]
            );
        }
    };

    this.delete = async (id) => {
        await this._operation('DELETE FROM "address" WHERE "id" = $1', [id]);
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
