from flask import Flask, request, jsonify
from flask_mongoengine import MongoEngine
from flask_fcm import FCM

app = Flask(__name__)
app.config['MONGODB_DB'] = 'flight_status'
db = MongoEngine(app)
fcm = FCM(app)

class FlightStatus(db.Document):
    flight_number = db.StringField(required=True)
    departure_time = db.DateTimeField(required=True)
    arrival_time = db.DateTimeField(required=True)
    status = db.StringField(required=True)

@app.route('/api/flight_status', methods=['GET'])
def get_flight_status():
    flight_status = FlightStatus.objects.all()
    return jsonify([fs.to_dict() for fs in flight_status])

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    notifications = Notification.objects.all()
    return jsonify([n.to_dict() for n in notifications])

@app.route('/api/send_notification', methods=['POST'])
def send_notification():
    data = request.get_json()
    notification = Notification(title=data['title'], body=data['body'])
    notification.save()
    fcm.send_notification(notification.to_dict(), data['token'])
    return 'Notification sent successfully!'

class Notification(db.Document):
    title = db.StringField(required=True)
    body = db.StringField(required=True)

if __name__ == '__main__':
    app.run(debug=True)