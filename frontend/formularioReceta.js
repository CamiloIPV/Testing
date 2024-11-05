document.addEventListener("DOMContentLoaded", () => {
    const recetaForm = document.getElementById("recetaForm");
    const btnVerReceta = document.getElementById("btnVerReceta");

    let recetaEditar = JSON.parse(localStorage.getItem("recetaEditar"));

    if (recetaEditar) {
        document.getElementById("dosis").value = recetaEditar.dosis;
        document.getElementById("diasTratamiento").value = recetaEditar.diasTratamiento;
        document.getElementById("unidadesMedicamento").value = recetaEditar.unidadesMedicamento;
        document.getElementById("viaAdministracion").value = recetaEditar.viaAdministracion;
    }

    recetaForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nuevaReceta = {
            dosis: document.getElementById("dosis").value,
            diasTratamiento: document.getElementById("diasTratamiento").value,
            unidadesMedicamento: document.getElementById("unidadesMedicamento").value,
            viaAdministracion: document.getElementById("viaAdministracion").value,
        };

        let recetas = JSON.parse(localStorage.getItem("recetas")) || [];

        if (recetaEditar) {
            recetas[recetaEditar.index] = nuevaReceta;
            localStorage.removeItem("recetaEditar");
        } else {
            recetas.push(nuevaReceta);
        }

        localStorage.setItem("recetas", JSON.stringify(recetas));
        recetaForm.reset();
        window.location.href = "receta_visualizador.html";
    });

    btnVerReceta.addEventListener("click", () => {
        window.location.href = "receta_visualizador.html";
    });
});
