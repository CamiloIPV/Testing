const express = require('express');
const bodyParser = require('body-parser');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const awsConfig = require('./awsConfig');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const AWS = require('aws-sdk'); // Agregamos el SDK de AWS

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Sirve archivos estáticos desde la carpeta frontend

// Configurar DynamoDB
AWS.config.update({
  region: 'us-east-1', // Asegúrate de que esta región coincida con la configuración de tu DynamoDB
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const poolData = {
  UserPoolId: awsConfig.userPoolId,
  ClientId: awsConfig.clientId,
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Registro de usuario
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  const attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: email,
    }),
  ];

  userPool.signUp(username, password, attributeList, null, (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message || JSON.stringify(err) });
    }
    res.json({ message: 'Usuario registrado correctamente', username: result.user.getUsername() });
  });
});

// Login de usuario
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: username,
    Password: password,
  });

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      const accessToken = result.getAccessToken().getJwtToken();
      res.json({ message: 'Login exitoso', accessToken });
    },
    onFailure: (err) => {
      res.status(400).json({ error: err.message || JSON.stringify(err) });
    },
  });
});

// Endpoint para buscar en la API de MedlinePlus
app.get('/api/search', (req, res) => {
  const term = req.query.term;

  if (!term) {
    return res.status(400).json({ error: 'Debe proporcionar un término de búsqueda' });
  }

  const apiUrl = `https://wsearch.nlm.nih.gov/ws/query?db=healthTopicsSpanish&term=${encodeURIComponent(term)}`;

  fetch(apiUrl)
    .then(response => response.text())
    .then(data => {
      res.send(data); // Enviamos la respuesta XML como texto
    })
    .catch(error => {
      console.error('Error al consultar la API:', error);
      res.status(500).json({ error: 'Error al consultar la API de MedlinePlus' });
    });
});


// Iniciar el servidor en el puerto 3000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
