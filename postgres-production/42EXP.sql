-- postgres version 9.4
-- RUN THIS THE FIRST TIME. ONLY ONCE

DROP DATABASE IF EXISTS "42EXP";
CREATE DATABASE "42EXP";

\c 42EXP;

CREATE TABLE IF NOT EXISTS Account(
  id SERIAL PRIMARY KEY,
  Username VARCHAR(40) UNIQUE,
  Email VARCHAR(40) UNIQUE,
  Password VARCHAR,
  Join_date TIMESTAMPTZ DEFAULT NOW(),
  XP INTEGER DEFAULT 0,
  Level Integer DEFAULT 1,
  Provider VARCHAR,
  is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Skill(
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE
);

CREATE TABLE IF NOT EXISTS Category(
  id SERIAL PRIMARY KEY,
  name VARCHAR(25) UNIQUE
);

CREATE TABLE IF NOT EXISTS Project(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  Owner VARCHAR REFERENCES Account (Username) ON UPDATE CASCADE ON DELETE CASCADE,
  Description text,
  Link VARCHAR,
  Category VARCHAR REFERENCES Category (name) ,
  Create_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Account_Projects(
  id SERIAL PRIMARY KEY,
  Username VARCHAR REFERENCES Account (Username),
  Project VARCHAR REFERENCES Project (name) ON DELETE CASCADE ON UPDATE CASCADE,
  Join_date TIMESTAMPTZ DEFAULT NOW(),
  ROLE VARCHAR(10),
  Last_activity TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(Username,Project)
);

CREATE TABLE IF NOT EXISTS Project_Messages(
  id SERIAL PRIMARY KEY,
  Project VARCHAR REFERENCES Project (name) ON DELETE CASCADE ON UPDATE CASCADE,
  Message Text,
  Username VARCHAR REFERENCES Account (Username),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Account_skills(
  id SERIAL PRIMARY KEY,
  Username VARCHAR REFERENCES Account (Username),
  Skill VARCHAR REFERENCES skill (name),
  Commends INTEGER DEFAULT 0,
  UNIQUE(Username,skill)
);

CREATE TABLE IF NOT EXISTS Project_skills(
  id SERIAL PRIMARY KEY,
  Project VARCHAR REFERENCES Project (name) ON DELETE CASCADE ON UPDATE CASCADE,
  Skill VARCHAR REFERENCES skill (name),
  UNIQUE(Project,Skill)
);

CREATE TABLE IF NOT EXISTS VOTES(
  id SERIAL PRIMARY KEY,
  Voter VARCHAR REFERENCES Account(Username),
  Votee VARCHAR REFERENCES Account(Username),
  skill INTEGER REFERENCES Account_skills (id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (Voter,Votee,skill)
);

CREATE TABLE IF NOT EXISTS ACCOUNT_NOTIFICATIONS(
  id SERIAL PRIMARY KEY,
  Username VARCHAR REFERENCES Account(Username),
  message VARCHAR,
  unread BOOLEAN default true,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);


-- include functions

-- function to determine number of unread_messages per project
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



--Determing user level when user xp is increased

  CREATE OR REPLACE FUNCTION set_user_level() RETURNS TRIGGER AS $level$

    BEGIN

      CASE
        WHEN NEW.xp BETWEEN 0 AND 50 THEN
          NEW.level = 1;
        WHEN NEW.xp BETWEEN 50 AND 150 THEN
          NEW.level = 2;
        WHEN NEW.xp BETWEEN 150 AND 350 THEN
          NEW.level = 3;
        WHEN NEW.xp BETWEEN 350 AND 750 THEN
          NEW.level = 4;
        WHEN NEW.xp BETWEEN 750 AND 1550 THEN
          NEW.level = 5;
        WHEN NEW.xp BETWEEN 1550 AND 3150 THEN
          NEW.level = 6;
        WHEN NEW.xp BETWEEN 3150 AND 6350 THEN
          NEW.level = 7;
        WHEN NEW.xp BETWEEN 6350 AND 12750 THEN
          NEW.level = 8;
        ELSE
          NEW.level = 9;
      END CASE;

      RETURN NEW;
    END;
  $level$ LANGUAGE plpgsql;


-- add_commends
CREATE OR REPLACE FUNCTION add_commends() RETURNS TRIGGER AS $$

  BEGIN

  UPDATE Account_skills set commends = commends + 1 WHERE id = NEW.skill;

  RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

-- create db triggers. user commends is added on vote.
CREATE TRIGGER add_commends AFTER INSERT ON votes FOR EACH ROW EXECUTE PROCEDURE add_commends();

CREATE TRIGGER set_user_level BEFORE UPDATE ON account FOR EACH ROW EXECUTE PROCEDURE set_user_level();

-- add skills
\COPY skill (name) FROM 'skill_list.txt';

\COPY category(name) FROM 'category-list.txt';
