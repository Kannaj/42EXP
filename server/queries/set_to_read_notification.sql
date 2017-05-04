UPDATE account_notifications SET unread=false
  WHERE username = $1
