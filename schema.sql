CREATE TABLE user(
  email varchar(30) PRIMARY KEY,
  password varchar(30),
  firstName varchar(20),
  familyName varchar(20),
  gender BOOLEAN,
  city varchar(20),
  country varchar(20),
  loggedIn BOOLEAN,
  token VARCHAR(32)
);

CREATE TABLE message(
  id INTEGER PRIMARY KEY,
  sender varchar(30),
  receiver varchar(30),
  message varchar(160),

  CONSTRAINT fk_user_message_sender
  FOREIGN KEY (sender) REFERENCES user(email)

  CONSTRAINT fk_user_message_receiver
  FOREIGN KEY (receiver) REFERENCES user(email)
);
