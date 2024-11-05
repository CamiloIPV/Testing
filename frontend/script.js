document.getElementById('searchButton').addEventListener('click', () => {
    const searchTerm = document.getElementById('searchTerm').value.trim();

    if (searchTerm) {
        // Redirigir a buscador.html pasando el término de búsqueda como parámetro
        window.location.href = `buscador.html?term=${encodeURIComponent(searchTerm)}`;
    } else {
        alert('Por favor ingresa un término de búsqueda.');
    }
});

