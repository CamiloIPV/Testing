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

    // Lista de dominios permitidos
    const allowedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'medico.cl', 'paciente.cl'];

    // Extraer el dominio del correo electrónico del usuario
    const emailDomain = username.split('@')[1];

    // Verificar si el dominio del correo está en la lista permitida
    if (!allowedDomains.includes(emailDomain)) {
      alert('Error: El dominio de correo no está permitido.');
      return;
    }

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

        // Redirección según el grupo del usuario
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
  
