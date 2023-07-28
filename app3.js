document.addEventListener('DOMContentLoaded', function () {
    const h1Saludo = document.getElementById('saludo');
    const nombreUsuario = localStorage.getItem('nombre');

    if (nombreUsuario) {
        h1Saludo.textContent = 'Bienvenido, ' + nombreUsuario + '!';
    }

    const carrito = document.getElementById('carrito');
    if (carrito) {
        carrito.style.display = 'none';
    }

    const cards = document.getElementsByClassName('card');
    let activeDivisasContainer = null;

    for (const card of cards) {
        card.addEventListener('click', function (event) {
            const existingDivisasContainer = this.querySelector('.divisas-container');

            if (activeDivisasContainer && activeDivisasContainer !== existingDivisasContainer) {
                activeDivisasContainer.remove();
            }

            if (existingDivisasContainer) {
                existingDivisasContainer.remove();
                activeDivisasContainer = null;
            } else {
                const continente = this.getAttribute('data-continente');
                const divisasContinentes = divisas.filter(function (divisa) {
                    return divisa.continente === continente;
                });

                const divisasContainer = document.createElement('div');
                divisasContainer.classList.add('divisas-container');

                divisasContinentes.forEach(function (divisa) {
                    const divisaItem = document.createElement('div');
                    divisaItem.classList.add('divisa-item');

                    const nombreDivisa = document.createElement('p');
                    nombreDivisa.textContent = divisa.nombre;

                    const cantidadInput = document.createElement('input');
                    cantidadInput.type = 'number';
                    cantidadInput.placeholder = 'Ingrese la cantidad de ' + divisa.nombre.toLowerCase();

                    cantidadInput.addEventListener('click', function (event) {
                        event.stopPropagation();
                    });

                    const confirmButton = document.createElement('button');
                    confirmButton.textContent = 'Agregar al carrito';

                    confirmButton.addEventListener('click', function (event) {
                        event.stopPropagation();

                        const cantidadDivisas = cantidadInput.value;

                        if (cantidadDivisas) {
                            const valorBlue = divisa.valorBlue;
                            const cantidadPesos = cantidadDivisas * valorBlue;

                            const carrito = document.getElementById('carrito');

                            const carritoItem = document.createElement('div');
                            carritoItem.classList.add('carrito-item');

                            const nombreDivisaCarrito = document.createElement('p');
                            nombreDivisaCarrito.textContent = divisa.nombre;
                            nombreDivisaCarrito.classList.add('nombre-divisa');

                            const cantidad = document.createElement('p');
                            cantidad.textContent = 'Cantidad: ' + cantidadDivisas + ' (' + cantidadPesos.toFixed(2) + ' pesos argentinos)';

                            const deleteButton = document.createElement('button');
                            deleteButton.textContent = 'Eliminar';

                            deleteButton.addEventListener('click', function () {
                                carrito.removeChild(carritoItem);
                                actualizarDatosCarrito();
                            });

                            carritoItem.appendChild(nombreDivisaCarrito);
                            carritoItem.appendChild(cantidad);
                            carritoItem.appendChild(deleteButton);

                            carrito.appendChild(carritoItem);

                            actualizarDatosCarrito();

                            cantidadInput.value = '';
                        }
                    });

                    divisaItem.appendChild(nombreDivisa);
                    divisaItem.appendChild(cantidadInput);
                    divisaItem.appendChild(confirmButton);

                    divisasContainer.appendChild(divisaItem);
                });

                this.appendChild(divisasContainer);
                activeDivisasContainer = divisasContainer;
            }

            event.stopPropagation();
        });
    }

    cargarDatosCarrito();

    function cargarDatosCarrito() {
        // Código para cargar datos del carrito desde localStorage
        const carritoItems = localStorage.getItem('carritoItems');

        if (carritoItems) {
            const carritoItemsArray = JSON.parse(carritoItems);

            carritoItemsArray.forEach(function (item) {
                const carrito = document.getElementById('carrito');

                const carritoItem = document.createElement('div');
                carritoItem.classList.add('carrito-item');

                const nombreDivisaCarrito = document.createElement('p');
                nombreDivisaCarrito.textContent = item.nombre;
                nombreDivisaCarrito.classList.add('nombre-divisa');

                const cantidad = document.createElement('p');
                cantidad.textContent = item.cantidad;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';

                deleteButton.addEventListener('click', function () {
                    carrito.removeChild(carritoItem);
                    actualizarDatosCarrito();
                });

                carritoItem.appendChild(nombreDivisaCarrito);
                carritoItem.appendChild(cantidad);
                carritoItem.appendChild(deleteButton);

                carrito.appendChild(carritoItem);
            });
        }
    }

    const botonVerCarrito = document.getElementById('ver-carrito');
    botonVerCarrito.addEventListener('click', function () {
        // Código para manejar la visualización del carrito
        const carrito = document.getElementById('carrito');
        const isVisible = carrito.style.display === 'block';

        if (isVisible) {
            carrito.style.display = 'none';
            botonVaciarCarrito.style.display = 'none';
        } else {
            const carritoItems = document.querySelectorAll('#carrito .carrito-item');

            if (carritoItems.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Carrito vacío',
                    text: 'El carrito está vacío. Agrega productos para continuar.',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                carrito.style.display = 'block';
                actualizarDatosCarrito();
            }
        }
    });

    const botonVaciarCarrito = document.getElementById('vaciar-carrito');
    botonVaciarCarrito.addEventListener('click', function () {
        mostrarAlertaVaciarCarrito();
    });

    function mostrarAlertaVaciarCarrito() {
        // Código para mostrar la alerta y vaciar el carrito
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, vaciar carrito',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito();
                Swal.fire({
                    title: 'Vaciar Carrito',
                    text: 'El carrito ha sido vaciado.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        });
    }

    function vaciarCarrito() {
        // Código para vaciar el carrito
        const carrito = document.getElementById('carrito');
        carrito.innerHTML = '';
        localStorage.setItem('carritoItems', JSON.stringify([]));

        // Actualizar el estado del botón Vaciar Carrito después de vaciarlo
        botonVaciarCarrito.style.display = 'none';
    }

    function actualizarDatosCarrito() {
        // Código para actualizar los datos del carrito y localStorage
        const carritoItems = document.querySelectorAll('#carrito .carrito-item');
        const carrito = document.getElementById('carrito');

        const carritoData = Array.from(carritoItems).map(function (item) {
            return {
                nombre: item.querySelector('p.nombre-divisa').textContent,
                cantidad: item.querySelector('p:not(.nombre-divisa)').textContent
            };
        });

        localStorage.setItem('carritoItems', JSON.stringify(carritoData));

        if (carritoItems.length > 0) {
            carrito.style.display = 'block';
            botonVaciarCarrito.style.display = 'block';
        } else {
            carrito.style.display = 'none';
            botonVaciarCarrito.style.display = 'none';
        }
    }

    const urlLocal = './divisas.json';
    let divisas = [];

    fetch(urlLocal)
        .then(response => response.json())
        .then(data => {
            divisas = data.divisas;
        })
        .catch(error => {
            mostrarMensajeError('Error al obtener las divisas', error);
        });

    function mostrarMensajeError(title, error) {
        // Función para mostrar mensaje de error con SweetAlert
        Swal.fire({
            icon: 'error',
            title: title,
            text: error.message || 'Ha ocurrido un error inesperado.',
            confirmButtonText: 'Cerrar',
        });
    }
});
