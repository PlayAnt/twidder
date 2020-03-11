#This file shall contain all the server​ side remote procedures, implemented using Python and Flask.
import json
import database_helper
from uuid import uuid4
from flask import Flask, request
from flask import jsonify
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

#Fixa header i authorization + URl på get

socks = [{'email' : 'Trashmail', 'socket' : 0}]

app = Flask(__name__)

@app.route('/boom', methods=['GET'])
def booms():
    print(socks)
    print(socks[0])
    return "0"

@app.route('/socket', methods=['GET'])
def sockets():
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']
        message = ws.receive()
        email = database_helper.tokenToEmail(message)
        if email != 0:
            bool = True
            for x in socks:
                if x['email'] == email:
                    x['socket'] = ws
                    bool = False
                    break
            if bool:
                a = {
                "email" : email,
                "socket": ws
                }
                socks.append(a.copy())
                print("Appended into Socks")
        else:
            print("Failed to find email")
    else:
        print("Failed to find Websocket")

    while True:
        try:
            response = ws.receive()
        except:
            print("I die :(")
            return "0"
    return "0"

@app.route('/', methods=['GET'])
def index():

    return app.send_static_file('client.html')

@app.route('/signin', methods=['POST'])
def sign_in(): #email, password

    credentials = request.get_json()

    if database_helper.confirmPassword(credentials['email'],credentials['password']) \
     and database_helper.validateEmail(credentials['email']):
        i = 0
        for x in socks:
            if x['email'] == credentials['email']:
                x['socket'].send("logout")
                x['socket'].close()
                socks.pop(i)
                break
            i += 1

        database_helper.setLoggedIn(credentials['email'])
        token = uuid4().hex

        database_helper.setToken(token, credentials['email'])

        return jsonify({"success": "true", "message": "Successfully signed in.", "token": token})

    return jsonify({"success": "false", "message": "Wrong username or password." })

@app.route('/signup', methods=['POST'])
def sign_up(): #email, password, firstName, familyName, gender, city, country, method=['POST']
    user = request.get_json()

    if not database_helper.validateEmail(user['email']):
        if 'email' in user and \
        'password' in user and \
        'firstName' in user and \
        'familyName' in user and \
        'gender' in user and \
        'city' in user and \
        'country' in user:
            database_helper.createUser(user);
            return jsonify({"success": "true", "message": "Successfully created a new user."})

        else:
            return jsonify({"success": "false", "message": "Form data missing or incorrect type."})

    else:
        return jsonify({"success": "false", "message": "User already exists."})

@app.route('/signout', methods=['GET'])
def sign_out(): #token
    token = request.headers.get('Authorization')[7:]

    if database_helper.validateToken(token):
        email = database_helper.tokenToEmail(token)
        i=0
        for x in socks:
            if x['email'] == email:
                x['socket'].close()
                socks.pop(i)
                break
            i += 1
        database_helper.setLoggedOut(token)
        return jsonify({"success": "true", "message": "Successfully signed out." })
    else:
        return jsonify({"success": "false", "message": "You are not signed in." })

@app.route('/changePassword', methods=['POST'])
def change_password(): #token, oldPassword, newPassword
    req = request.get_json()
    token = request.headers.get('Authorization')[7:]
    if database_helper.validateToken(token):
        print(req)
        if database_helper.validatePassword(token, req['oldPassword']):
            database_helper.replacePassword(token, req['newPassword'])
            return jsonify({"success": "true", "message": "Password changed."})
        else:
            return jsonify({"success": "false", "message": "Wrong password." })
    else:
        return jsonify({"success": "false", "message": "You are not signed in." })


@app.route('/getUserDataByToken', methods=['GET'])
def get_user_data_by_token(): #token
    token = request.headers.get('Authorization')[7:]    # print("Printing status " + str(status))
    data = database_helper.selectUser(token)

    if data != -1:
        return jsonify({"success": "true", "message": "User data retrieved.", "data": data})
    else: #data == -1
        return jsonify({"success": "false", "message": "You are not signed in." })

@app.route('/getUserDataByEmail/<email>', methods=['GET'])
def get_user_data_by_email(email): #token, email
    token = request.headers['authorization'][7:]
    data = database_helper.selectUserByEmail(token, email)
    print(data)

    if data != 0 and data != -1:
        return jsonify({"success": "true", "message": "User data retrieved.", "data": data})
    elif data == 0:
        return jsonify({"success": "false", "message": "No such user."})
    else: #data == -1
        return jsonify({"success": "false", "message": "You are not signed in." })

    return "Failed to find user by Email"

@app.route('/postMessage', methods=['POST'])
def post_message(): #token, message, email
    req = request.get_json()
    token = request.headers.get('Authorization')[7:]

    status = database_helper.insertMessage(token, req['message'], req['email'])

    if status == 1:
        return jsonify({"success": "true", "message": "Message posted."})
    elif status == 0:
        return jsonify({"success": "false", "message": "No such user."})
    else:
        return jsonify({"success": "false", "message": "You are not signed in."})

@app.route('/getUserMessagesByToken', methods=['GET'])
def get_user_messages_by_token(): #token
    token = request.headers['authorization'][7:]
    messages = database_helper.selectMessagesbyToken(token)
    if messages != -1:
        if messages != []:
            array = []

            for row in messages:
                array.append( {
                "sender": row[1],
                "receiver": row[2],
                "message": row[3]
                })

            return jsonify({"success": "true", "message": "User messages retrieved.", "data": array})
        else:
            return jsonify({"success": "false", "message": "You have no messages."})
    else:
        return jsonify({"success": "false", "message": "You are not signed in."})


@app.route('/getUserMessagesByEmail/<email>', methods=['GET'])
def get_user_messages_by_email(email): #token, email
    token = request.headers['authorization'][7:]

    messages = database_helper.selectMessagesbyEmail(token, email)
    if messages != -1:
        if messages != []:
            array = []

            for row in messages:
                array.append( {
                "sender": row[1],
                "receiver": row[2],
                "message": row[3]
                })

            return jsonify({"success": "true", "message": "User messages retrieved.", "data": array})
        else:
            return jsonify({"success": "false", "message": "No such user."})
    else:
        return jsonify({"success": "false", "message": "You are not signed in."})




if __name__ == '__main__':
    http_server = WSGIServer(('127.0.0.1', 5000), app, handler_class = WebSocketHandler)
    print(http_server)
    http_server.serve_forever()
# #    app.debug = True
#     app.run()
