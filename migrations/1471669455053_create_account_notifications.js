exports.up = function(pgm) {
  pgm.sql(
    `

    CREATE TABLE IF NOT EXISTS ACCOUNT_NOTIFICATIONS(
      id SERIAL PRIMARY KEY,
      Username VARCHAR REFERENCES Account(Username),
      message VARCHAR,
      unread BOOLEAN default true,
      timestamp TIMESTAMPTZ DEFAULT NOW()
    );


    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP TABLE account_notifications`)
};
