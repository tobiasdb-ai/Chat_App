const mqttClient = mqtt.connect('ws://localhost:1883', {
       username: 'tobias',
        password: 'tobias'
       });

      const username = prompt('Enter your username:');
      const clientID = 'user-' + (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)
      

      mqttClient.on('connect', function () {
        console.log('Connected to MQTT broker');

        mqttClient.subscribe('test/topic', function (err) {
          if (err) {
            console.error('Cant subscribe to topic:', err);
          } else {
            console.log('Subscribed to topic: test/topic');
            mqttClient.publish('test/topic', username + "(" + clientID + ")" + ' joined the chat');
          }
        });
      });

      mqttClient.on('message', function (topic, message) {
        console.log('Received message on topic', topic, ':', message.toString());

        document.getElementById("userfield").innerHTML = "Your username is: " + username;
        document.getElementById("idfield").innerHTML = "Your clientID is: " + clientID;

        const li = document.createElement('li');
        li.textContent = message.toString();

        if (message.toString().startsWith(username + "(" + clientID + ")")) {
          li.classList.add('sent');
        } else {
          li.classList.add('received');
        }

        document.getElementById('messages').appendChild(li);
      });
        
      document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        
        const message = document.getElementById('message').value;
        mqttClient.publish('test/topic', username + "(" + clientID + ")" + ': ' + message);
        document.getElementById('message').value = '';
      });