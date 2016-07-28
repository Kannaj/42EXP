SELECT id,message,unread from account_notifications where username=$1 and unread=true;
