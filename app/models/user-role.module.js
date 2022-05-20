const pool = require('../dataBase/bd');

module.exports = new function () {
    this.readAll = async () => {
        return await this._operation('SELECT "id", "user_id", "role_id" FROM "user_role"', null);
    };

    this.save = async (userRole) => {
        if (userRole.id !== undefined) {
            await this._operation(
                'UPDATE "user_role" SET  "user_id" = $1, "role_id" = $2 WHERE "id" = $3',
                [userRole.user_id, userRole.role_id, userRole.id]
            );
        } else {
            await this._operation(
                'INSERT INTO "user_role" ("user_id", "role_id") VALUES ($1, $2)',
                [userRole.user_id, userRole.role_id]
            );
        }
    };

    this.delete = async (id) => {
        await this._operation('DELETE FROM "user_role" WHERE "id" = $1', [id]);
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
