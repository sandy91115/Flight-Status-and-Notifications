import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

function App() {
  const [flightStatus, setFlightStatus] = React.useState({});
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    axios.get('/api/flight_status')
      .then(response => {
        setFlightStatus(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  React.useEffect(() => {
    axios.get('/api/notifications')
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSendNotification = () => {
    const title = 'Flight Status Update';
    const body = 'Your flight has been delayed';
    const token = 'your_fcm_token_here';
    axios.post('/api/send_notification', { title, body, token })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Flight Status</h1>
      <p>{flightStatus.flightNumber}</p>
      <p>{flightStatus.departureTime}</p>
      <p>{flightStatus.arrivalTime}</p>
      <h1>Notifications</h1>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id}>{notification.title}</li>
        ))}
      </ul>
      <button onClick={handleSendNotification}>Send Notification</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));