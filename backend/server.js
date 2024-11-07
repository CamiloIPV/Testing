// server.js
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

// Configuración de middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../Frontend'))); // Sirve archivos estáticos desde la carpeta Frontend

// Configuración de AWS
AWS.config.update({
  region: awsConfig.region, // Asegúrate de que esta región coincida con la configuración de tu Cognito
});
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

const poolData = {
  UserPoolId: awsConfig.userPoolId,
  ClientId: awsConfig.clientId,
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Endpoint de registro de usuario
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const newUser = await registerUser({ username, email, password });
    res.json({ message: 'Registro exitoso', user: newUser.getUsername() });
  } catch (err) {
    res.status(400).json({ error: err.message || JSON.stringify(err) });
  }
});

// Login de usuario
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

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
    onSuccess: async (result) => {
      const idToken = result.getIdToken().getJwtToken();
      const accessToken = result.getAccessToken().getJwtToken();

      // Obtener los grupos de usuarios
      const params = {
        UserPoolId: awsConfig.userPoolId,
        Username: username,
      };

      try {
        const userGroups = await cognitoIdentityServiceProvider.adminListGroupsForUser(params).promise();
        const groups = userGroups.Groups.map(group => group.GroupName);

        // Verificar que el usuario pertenezca a al menos uno de los grupos permitidos
        const allowedGroups = ['medicos', 'pacientes', 'farmaceuticos'];
        const isUserInAllowedGroup = groups.some(group => allowedGroups.includes(group.toLowerCase()));

        if (!isUserInAllowedGroup) {
          return res.status(403).json({ error: 'Acceso denegado: No pertenece a un grupo permitido' });
        }

        res.json({ message: 'Login exitoso', idToken, accessToken, groups });
      } catch (err) {
        console.error('Error al obtener grupos de usuario:', err);
        res.status(400).json({ error: err.message || JSON.stringify(err) });
      }
    },
    onFailure: (err) => {
      console.error('Error en la autenticación:', err);
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



