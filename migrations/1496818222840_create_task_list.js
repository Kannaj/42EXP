exports.up = function(pgm) {
  pgm.sql(
    `
      CREATE TABLE IF NOT EXISTS Project_tasks(
        id SERIAL PRIMARY KEY,
        project VARCHAR REFERENCES Project (name),
        name VARCHAR(30),
        description text,
        completed BOOLEAN,
        Create_date TIMESTAMPTZ DEFAULT NOW(),
        Modified_data TIMESTAMPTZ DEFAULT NOW()
      )
    `
  )
};

exports.down = function(pgm) {

};
