const { date } = require('../../lib/utils');

const db = require('../../config/db');

module.exports = {
  all() {
    
    return db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      GROUP BY chefs.id
      ORDER BY total_recipes DESC`)

  },
  chefRecipes(id) {
    return db.query(`
      SELECT recipes.*, chefs.name AS chefs_name
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      ORDER BY recipes.created_at DESC
    `, [id]);
  },
  create(data) {
    const query = `
      INSERT INTO chefs (
        name,
        file_id,
        created_at
      ) VALUES ($1, $2, $3)
      RETURNING id
    `

    const values = [
      data.name,
      data.file_id,
      date(Date.now()).iso
    ]
  
    return db.query(query, values)
  },
  find(id) {
    return db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id`, [id])
  },
  update(data) {
    const query = `
      UPDATE chefs SET
        name=($1),
        file_id=($2),
        created_at=($3)
      WHERE id = $4`

    const values = [
      data.name,
      data.file_id,
      data.created_at,
      data.id
    ]

    return db.query(query, values)
  },
  delete(id) {
    return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
  },
  file(id) {
    return db.query(`
    SELECT * FROM files WHERE id = $1`, [id]);
  }
}