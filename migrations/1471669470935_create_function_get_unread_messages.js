exports.up = function(pgm) {
  pgm.sql(
    `

    CREATE OR REPLACE FUNCTION get_unread_messages(projectid INTEGER,usertimestamp TIMESTAMPTZ)
      RETURNS INTEGER AS $$

      DECLARE
    	unread INTEGER;

      BEGIN
    	  SELECT COUNT(pm)
    	  FROM project_messages pm WHERE pm.project = (SELECT name from project WHERE project.id=projectid) AND timestamp > usertimestamp INTO unread;
    	  RETURN unread;
      END; $$

      LANGUAGE plpgsql;

    `
  )
};

exports.down = function(pgm) {
  pgm.sql(`DROP FUNCTION get_unread_messages`)
};
