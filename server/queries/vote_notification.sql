INSERT INTO account_notifications (username,message)
  VALUES ($1,$2) returning id,message,unread
