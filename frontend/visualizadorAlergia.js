document.addEventListener("DOMContentLoaded", () => {
    const alergiaTableBody = document.querySelector("#alergiaTable tbody");
    const btnRegistrarAlergia = document.getElementById("btnRegistrarAlergia");
    let indexParaEliminar = null;

    const modalConfirmacion = new bootstrap.Modal(document.getElementById("modalConfirmacion"));

    let alergias = JSON.parse(localStorage.getItem("alergias")) || [];

    const listarAlergias = () => {
        alergiaTableBody.innerHTML = "";
        alergias.forEach((alergia, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${alergia.nombre}</td>
                <td>${alergia.descripcion}</td>
                <td>
                    <button class="btn btn-warning btn-sm" data-index="${index}">Editar</button>
                    <button class="btn btn-danger btn-sm" data-index="${index}">Eliminar</button>
                </td>
            `;
            alergiaTableBody.appendChild(row);
        });

        // Asignar eventos a los botones de eliminar y editar
        document.querySelectorAll(".btn-danger").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                eliminarAlergia(index);
            });
        });

        document.querySelectorAll(".btn-warning").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                editarAlergia(index);
            });
        });
    };

    const eliminarAlergia = (index) => {
        indexParaEliminar = index;
        modalConfirmacion.show();
    };

    document.getElementById("btnConfirmarEliminacion").addEventListener("click", () => {
        if (indexParaEliminar !== null) {
            alergias.splice(indexParaEliminar, 1);
            localStorage.setItem("alergias", JSON.stringify(alergias));
            listarAlergias();
        }
        indexParaEliminar = null;
        modalConfirmacion.hide();
    });

    const editarAlergia = (index) => {
        const alergia = alergias[index];
        localStorage.setItem("alergiaEditar", JSON.stringify({ ...alergia, index }));
        window.location.href = "alergia_formulario.html";
    };

    btnRegistrarAlergia.addEventListener("click", () => {
        window.location.href = "alergia_formulario.html";
    });

    listarAlergias();
});
