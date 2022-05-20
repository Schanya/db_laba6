const pool = require('../dataBase/bd');

module.exports = new function () {
    this.readAll = async () => {
        return await this._operation('SELECT * FROM "order"', null);
    };

    this.read = async (id) => {
        if (id) {
            let res = await this._operation('SELECT "id", "order_date", "total_cost", "cleint_id", "managDecision", "status_id" FROM "order" WHERE "id" = $1', [id]);
            return res ? res[0] : null;
        } else {
            return null;
        }
    };

    this.readByClient = async (cleint_id) => {
        if (cleint_id) {
            let res = await this._operation('SELECT "id", "order_date", "total_cost", "cleint_id", "managDecision", "status_id" FROM "order" WHERE "cleint_id" = $1', [cleint_id]);
            return res ? res[0] : null;
        } else {
            return null;
        }
    };

    this.save = async (order) => {
        if (order.id !== undefined) {
            await this._operation(
                'UPDATE "order" SET  "order_date" = $1, "total_cost" = $2, "cleint_id" = $3, "managDecision" = $4, "status_id" = $5 WHERE "id" = $6',
                [order.order_date, order.total_cost, order.cleint_id, order.managDecision, order.status_id, order.id]
            );
        } else {
            await this._operation(
                'INSERT INTO "order" ("order_date", "total_cost", "cleint_id", "managDecision", "status_id") VALUES ($1, $2, $3, $4. $5)',
                [order.order_date, order.total_cost, order.cleint_id, order.managDecision, order.status_id]
            );
        }
    };

    this.delete = async (id) => {
        await this._operation('DELETE FROM "order" WHERE "id" = $1', [id]);
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
