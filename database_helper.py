import sqlite3
import sys
import os
import json

#Fix functions for open, commit, close
#Clean out unneccesarry commits
#What else?

def createUser(user):
    conn = sqlite3.connect('database.db')

    conn.execute("INSERT INTO user (email, password, firstName, familyName, gender, city, country, loggedIn) \
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)",(user["email"],user["password"],user["firstName"],user["familyName"],user["gender"], user["city"], user["country"], 0));

    conn.commit()
    conn.close()
    return 0

def validatePassword(token, password):
    conn = sqlite3.connect('database.db')

    for row in conn.execute("SELECT email FROM user WHERE token = ?", (token,)):
        email = row[0]
        break
    else:
        conn.close()
        return 0

    conn.close()

    return confirmPassword(email, password)

def replacePassword(token, newPassword):
    conn = sqlite3.connect('database.db')

    conn.execute("UPDATE user SET password = ? WHERE token = ?", (newPassword, token));

    conn.commit()
    conn.close()
    return 0

def confirmPassword(email, password):
    conn = sqlite3.connect('database.db')

    confirmPassword = ""

    for row in conn.execute("SELECT password FROM user WHERE email = ?", (email,)):
        confirmPassword = row[0]
        break

    if password == confirmPassword:
        conn.close()
        return 1
    else:
        conn.close()
        return 0
    conn.close()
    return 0

def validateEmail(email):
    conn = sqlite3.connect('database.db')

    confirmEmail = ""

    for row in conn.execute("SELECT email FROM user WHERE email = ?", (email,)):
        confirmEmail = row[0]
        break

    if confirmEmail == email:
        conn.close()
        return 1
    else:
        conn.close()
        return 0

    conn.close()
    return 0
def setLoggedIn(email):
    conn = sqlite3.connect('database.db')

    conn.execute("UPDATE user SET loggedIn = 1 WHERE email = ?", (email,));

    conn.commit()
    conn.close()
    return 0

def setToken(token, email):
    conn = sqlite3.connect('database.db')

    conn.execute("UPDATE user SET token = ? WHERE email = ?", (token, email));

    conn.commit()
    conn.close()
    return 0

def setLoggedOut(token):
    conn = sqlite3.connect('database.db')

    conn.execute("UPDATE user SET loggedIn = 0, token = 0 WHERE token = ?", (token,));

    conn.commit()
    conn.close()
    return 0

def selectUser(token):

    email = tokenToEmail(token)
    return selectUserByEmail(token, email)

def selectUserByEmail(token, email):
    if validateToken(token) == 1:
        conn = sqlite3.connect('database.db')

        for row in conn.execute("SELECT * FROM user WHERE email = ?", (email,)):
            data = {
            'email': row[0],
            'firstName' : row[2],
            'familyName' : row[3],
            'gender' : row[4],
            'city' : row[5],
            'country' : row[6]
            }
            break
        else:
            conn.close()
            return 0
        conn.close()
        return data
    else:
        return -1

def validateToken(token):
    conn = sqlite3.connect('database.db')

    for row in conn.execute("SELECT token FROM user WHERE token = ?", (token,)):
        if row[0] == '0':
            conn.close()
            return 0
        else:
            conn.close()
            return 1
    conn.close()
    return 0

def tokenToEmail(token):
    conn = sqlite3.connect('database.db')
    for row in conn.execute("SELECT email FROM user WHERE token = ?", (token,)):
        email = row[0]
        break
    else:
        conn.close()
        return 0

    conn.close()
    return email

def insertMessage(token, message, email):

    if validateToken(token):

        sender = tokenToEmail(token)

        confirmEmail = ""

        conn = sqlite3.connect('database.db')
        for row in conn.execute("SELECT email FROM user WHERE email = ?", (email,)):
            confirmEmail = row[0]
            break

        if confirmEmail == email:
            conn.execute("INSERT INTO message(sender, receiver, message) VALUES (?, ?, ?)",(sender, email, message));
            conn.commit()
            conn.close()
            return 1

        else:
            conn.close()
            return 0

        conn.close()
        return 0

    else:
        return -1

def selectMessagesbyEmail(token, email): #Fix dis! What do we return?

    if validateToken(token):
        conn = sqlite3.connect('database.db')
        cur = conn.cursor()
        cur.execute("SELECT * FROM message WHERE receiver = ?", (email,));
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows
    else:
        return -1

def selectMessagesbyToken(token):
    email = tokenToEmail(token)
    return selectMessagesbyEmail(token, email)
