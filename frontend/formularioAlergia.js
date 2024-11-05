document.addEventListener("DOMContentLoaded", () => {
    const alergiaForm = document.getElementById("alergiaForm");
    const btnVerAlergias = document.getElementById("btnVerAlergias");

    let alergiaEditar = JSON.parse(localStorage.getItem("alergiaEditar"));

    if (alergiaEditar) {
        document.getElementById("nombre").value = alergiaEditar.nombre;
        document.getElementById("descripcion").value = alergiaEditar.descripcion;
    }

    alergiaForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nuevaAlergia = {
            nombre: document.getElementById("nombre").value,
            descripcion: document.getElementById("descripcion").value,
        };

        let alergias = JSON.parse(localStorage.getItem("alergias")) || [];

        if (alergiaEditar) {
            alergias[alergiaEditar.index] = nuevaAlergia;
            localStorage.removeItem("alergiaEditar");
        } else {
            alergias.push(nuevaAlergia);
        }

        localStorage.setItem("alergias", JSON.stringify(alergias));
        alergiaForm.reset();
        window.location.href = "alergia_visualizador.html";
    });

    btnVerAlergias.addEventListener("click", () => {
        window.location.href = "alergia_visualizador.html";
    });
});
