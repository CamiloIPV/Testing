document.getElementById('loginForm').addEventListener('submit', async (event) => {
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


//REGISTRAR USUARIO
          // Manejar el registro de usuario
          document.getElementById('registerForm').addEventListener('submit', async (event) => {
            event.preventDefault();
        
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
        
            try {
                const response = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                });
        
                const data = await response.json();
                if (response.ok) {
                    alert('Usuario registrado: ' + data.username);
                    // Opcionalmente, redirigir al usuario a la página de inicio de sesión
                    window.location.href = 'formulario_login.html';
                } else {
                    alert('Error: ' + data.error);
                }
            } catch (error) {
                console.error('Error al registrar el usuario:', error);
                alert('Hubo un problema al registrar el usuario. Por favor, inténtelo de nuevo.');
            }
        });