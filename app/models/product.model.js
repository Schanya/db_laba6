const pool = require('../dataBase/bd');

module.exports = new function () {
    this.readAll = async () => {
        return await this._operation('SELECT * FROM "product"', null);
    };

    this.read = async (id) => {
        if (id) {
            let res = await this._operation('SELECT "id", "title", "price", "description", catigory_id FROM "product" WHERE "id" = $1', [id]);
            return res ? res[0] : null;
        } else {
            return null;
        }
    };

    this.save = async (product) => {
        if (product.id !== undefined) {
            await this._operation(
                'UPDATE "product" SET  "title" = $1, "price" = $2, "description" = $3, "catigory_id" = $4 WHERE "id" = $5',
                [product.title, product.price, product.description, product.catigory_id, product.id]
            );
        } else {
            await this._operation(
                'INSERT INTO "product" ("title", "price", "description", "catigory_id") VALUES ($1, $2, $3, $4)',
                [product.title, product.price, product.description, product.catigory_id]
            );
        }
    };

    this.delete = async (id) => {
        await this._operation('DELETE FROM "product" WHERE "id" = $1', [id]);
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
