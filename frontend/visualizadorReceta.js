document.addEventListener("DOMContentLoaded", () => {
    const recetaTableBody = document.querySelector("#recetaTable tbody");
    const btnRegistrarReceta = document.getElementById("btnRegistrarReceta");
    let indexParaEliminar = null; // Guardará el índice de la receta a eliminar

    // Crear instancia del modal globalmente
    const modalConfirmacion = new bootstrap.Modal(document.getElementById("modalConfirmacion"));

    let recetas = JSON.parse(localStorage.getItem("recetas")) || [];

    const listarRecetas = () => {
        recetaTableBody.innerHTML = "";
        recetas.forEach((receta, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${receta.dosis}</td>
                <td>${receta.diasTratamiento}</td>
                <td>${receta.unidadesMedicamento}</td>
                <td>${receta.viaAdministracion}</td>
                <td>
                    <button class="btn btn-warning btn-sm" data-index="${index}">Editar</button>
                    <button class="btn btn-danger btn-sm" data-index="${index}">Eliminar</button>
                </td>
            `;
            recetaTableBody.appendChild(row);
        });

        // Asignar eventos a los botones de eliminar y editar
        document.querySelectorAll(".btn-danger").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                eliminarReceta(index);
            });
        });

        document.querySelectorAll(".btn-warning").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                editarReceta(index);
            });
        });
    };

    const eliminarReceta = (index) => {
        indexParaEliminar = index; // Guardar el índice para usarlo después
        modalConfirmacion.show(); // Mostrar el modal
    };

    document.getElementById("btnConfirmarEliminacion").addEventListener("click", () => {
        if (indexParaEliminar !== null) {
            recetas.splice(indexParaEliminar, 1); // Eliminar receta
            localStorage.setItem("recetas", JSON.stringify(recetas)); // Guardar cambios
            listarRecetas(); // Actualizar la lista
        }
        indexParaEliminar = null; // Resetear el índice
        modalConfirmacion.hide(); // Cerrar el modal
    });

    const editarReceta = (index) => {
        const receta = recetas[index];
        localStorage.setItem("recetaEditar", JSON.stringify({ ...receta, index }));
        window.location.href = "receta_formulario.html";
    };

    btnRegistrarReceta.addEventListener("click", () => {
        window.location.href = "receta_formulario.html";
    });

    listarRecetas();
});


