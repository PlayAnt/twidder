INSERT INTO user(email, password, firstName, familyName, gender, city, country, loggedIn, token)
VALUES ("greenarrow@JL.com", "123", "Oliver", "Queen", "1", "Star City", "America", 0, 0);

INSERT INTO user(email, password, firstName, familyName, gender, city, country, loggedIn, token)
VALUES ("superman@JL.com", "456", "Clark", "Kent", "1", "Smallville", "America", 0, 0);

INSERT INTO user(email, password, firstName, familyName, gender, city, country, loggedIn, token)
VALUES ("batman@JL.com", "789", "Bruce", "Wayne", "1", "Gotham City", "America", 0, 0);

INSERT INTO user(email, password, firstName, familyName, gender, city, country, loggedIn, token)
VALUES ("wonderwoman@JL.com", "321", "Diana", "Prince", "0", "Themyscera", "Olympia", 0, 0);

INSERT INTO message(sender, receiver, message)
VALUES ("superman@JL.com", "batman@JL.com", "Hi Bruce! Should we get together for another all-stars?");

INSERT INTO message(sender, receiver, message)
VALUES ("batman@JL.com", "superman@JL.com", "Hi Clark! Yeah, why not? They are usually profitable.");

INSERT INTO message(sender, receiver, message)
VALUES ("superman@JL.com", "batman@JL.com", "I would like to believe that our friendship mean more to you than that.");

INSERT INTO message(sender, receiver, message)
VALUES ("batman@JL.com", "superman@JL.com", "Mayby.");

INSERT INTO message(sender, receiver, message)
VALUES ("greenarrow@JL.com", "batman@JL.com", "How do you keep up with the super freaks?.");

INSERT INTO message(sender, receiver, message)
VALUES ("batman@JL.com", "greenarrow@JL.com", "Money!.");

INSERT INTO message(sender, receiver, message)
VALUES ("greenarrow@JL.com", "batman@JL.com", "Hahaha, that I could manage!.");

INSERT INTO message(sender, receiver, message)
VALUES ("wonderwoman@JL.com", "batman@JL.com", "I've learned that you have found an ancient artifact belonging to the amazons.");

INSERT INTO message(sender, receiver, message)
VALUES ("batman@JL.com", "wonderwoman@JL.com", "Master Bruce is otherwise occupied but I am sure that you can come over with your flying jet and pick it up. /Alfred");
