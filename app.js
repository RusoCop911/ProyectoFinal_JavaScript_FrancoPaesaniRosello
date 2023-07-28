function convertirAMayusculas() {
    let inputNombre = document.getElementById("nombre");
    inputNombre.value = inputNombre.value.toUpperCase();
}

document.getElementById('boton').addEventListener('click', function () {
    const nombreInput = document.getElementById('nombre');
    const cuitInput = document.getElementById('cuit');
    const nombre = nombreInput.value.trim();
    const cuit = cuitInput.value.trim();

    if (!nombre || !cuit || !/^[A-Za-z\s]+$/.test(nombre) || isNaN(Number(cuit))) {
        Swal.fire({
            title: 'Error!',
            text: "Ingrese un nombre y apellido válido (solo letras y espacios) y un número de CUIT válido (solo números).",
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    localStorage.setItem('nombre', nombre);
    localStorage.setItem('cuit', cuit);

    window.location.href = 'aplicacion.html';
});

