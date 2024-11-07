document.addEventListener('DOMContentLoaded', () => {
    console.log("app.js cargado correctamente"); // Verificación de carga
  
    // Manejador de Envío del Formulario de Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita recarga de página
        console.log("Registro: preventDefault ejecutado");
  
        // Captura los valores del formulario
        const nombreCompleto = document.getElementById('nombreCompleto').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('contraseña').value;
  
        // Llamada al servidor para registrar usuario
        try {
          const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: nombreCompleto, email: email, password: password })
          });
  
          const result = await response.json();
          console.log("Respuesta del servidor en registro:", result);
  
          if (response.ok) {
            alert('Registro exitoso');
            registerForm.reset();
          } else {
            alert('Error en el registro: ' + result.error);
          }
        } catch (error) {
          console.error('Error en el registro:', error);
          alert('Hubo un problema con el registro. Intenta de nuevo.');
        }
      });
    }
  
    // Manejador de Envío del Formulario de Inicio de Sesión
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita recarga de página
        console.log("Inicio de sesión: preventDefault ejecutado");
  
        // Captura los valores del formulario
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
  
        // Llamada al servidor para iniciar sesión
        try {
          const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
  
          const data = await response.json();
          console.log('Respuesta del servidor en inicio de sesión:', data);
  
          if (response.ok) {
            alert('Inicio de sesión exitoso');
            localStorage.setItem('idToken', data.idToken);
            localStorage.setItem('accessToken', data.accessToken);
  
            if (data.groups.includes('Paciente')) {
              window.location.href = 'inicio_paciente.html';
            } else if (data.groups.includes('Medico')) {
              window.location.href = 'inicio_medico.html';
            } else {
              alert('Grupo de usuario no reconocido.');
            }
          } else {
            alert('Error en el inicio de sesión: ' + data.error);
          }
        } catch (error) {
          console.error('Error en inicio de sesión:', error);
          alert('Hubo un problema al iniciar sesión. Intenta de nuevo.');
        }
      });
    }
  });
  /*document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log('Response from server:', data);

        if (response.ok) {
            const idToken = data.idToken;  // Ahora obtenemos el idToken
            const accessToken = data.accessToken;

            // Almacenar los tokens en localStorage
            localStorage.setItem('idToken', idToken);
            localStorage.setItem('accessToken', accessToken);

            // Redirigir según el dominio del correo
            if (username.endsWith('@paciente.cl')) {
                window.location.href = 'inicio_paciente.html';  
            } else if (username.endsWith('@medico.cl')) {
                window.location.href = 'inicio_medico.html';  
            } else if (username.endsWith('@farmaceutico.cl')) {
                window.location.href = 'inicio_farmaceutico.html';  
            } else {
                alert('Dominio de correo no reconocido.');
            }
        } else {
            alert('Error en el login: ' + data.error);
        }
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        alert('Hubo un problema al iniciar sesión. Por favor, inténtelo de nuevo.');
    }
    
});
  
*/
