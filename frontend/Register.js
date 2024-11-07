// Register.js
document.addEventListener('DOMContentLoaded', () => {
  // Selecciona el formulario de registro
  const registerForm = document.getElementById('registerForm');

  // Verifica si el formulario está en el DOM
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Previene la recarga de la página

      // Captura los valores de los campos
      const nombreCompleto = document.getElementById('nombreCompleto').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('contraseña').value;
      const aceptoTerminos = document.getElementById('aceptoTerminos').checked;

      // Verifica si el usuario ha aceptado los términos
      if (!aceptoTerminos) {
        alert('Debe aceptar los términos y condiciones para continuar.');
        return;
      }

      // Enviar los datos al backend
      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: nombreCompleto,
            email: email,
            password: password,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert('Registro exitoso');
          registerForm.reset(); // Limpia el formulario después del registro
          // Redirige al usuario si es necesario, o muestra otro mensaje
        } else {
          alert('Error en el registro: ' + result.error);
        }
      } catch (error) {
        console.error('Error al registrar:', error);
        alert('Hubo un problema con el registro. Intenta de nuevo.');
      }
    });
  } else {
    console.error('Formulario de registro no encontrado.');
  }
});

  
