const { date } = require('../../lib/utils');
const db = require('../../config/db');

module.exports = {
  all(callback) {
    
    db.query(`SELECT * FROM recipes`, function(err, results) {
      if(err) throw `Database Error! ${err}`;
      
      callback(results.rows)
    })

  },
  create(data, callback) {
    const query = `
      INSERT INTO recipes (
        image,
        title,
        ingredients,
        preparation,
        information,
        created_at,
        chef_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `

    const values = [
      data.image,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso,
      data.chef_id
    ]
  
    db.query(query, values, function(err, results) {
      if(err) throw `Database Error! ${err}`;
      
      callback(results.rows[0]);
    })
  },
  find(id, callback) {
    db.query(`
      SELECT * 
      FROM recipes
      WHERE id = $1`, [id], function(err, results) {
        if(err) throw `Database Error! ${err}`;

        callback(results.rows[0]);
      })
  },
  update(data, callback) {
    const query = `
      UPDATE recipes SET
        image=($1),
        title=($2),
        ingredients=($3),
        preparation=($4),
        information=($5),
        created_at=($6),
        chef_id=($7)
      WHERE id = $8`

    const values = [
      data.image,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.created_at,
      data.chef_id,
      data.id
    ]

    db.query(query, values, function(err, results) {
      if(err) throw `Database Error! ${err}`;

      callback();
    })
  },
  delete(id, callback) {
    db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results) {
      if(err) throw `Database Error! ${err}`;

      return callback()
    })
  }
}