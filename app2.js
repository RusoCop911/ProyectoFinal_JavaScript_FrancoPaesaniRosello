document.addEventListener('DOMContentLoaded', function () {
    const h1Saludo = document.getElementById('saludo');
    const nombreUsuario = localStorage.getItem('nombre');

    if (nombreUsuario) {
        h1Saludo.textContent = 'Bienvenido, ' + nombreUsuario + '!';
    }

    const tarjetaCompra = document.querySelector('[data-compraVenta="Compra"]');
    const tarjetaVender = document.querySelector('[data-compraVenta="Venta"]');

    tarjetaCompra.addEventListener('click', function () {
        window.location.href = "aplicacion2.html";
    });

    let calculadoraAbierta = false;
    let divVenta = null;
    let divisas = [];

    tarjetaVender.addEventListener('click', function () {
        if (calculadoraAbierta) {
            cerrarCalculadoraVenta();
            calculadoraAbierta = false;
        } else {
            mostrarCalculadoraVenta();
            calculadoraAbierta = true;
        }
    });

    function mostrarCalculadoraVenta() {
        const tarjetasCompraVenta = document.getElementById('tarjetas-compraVenta');
        divVenta = document.createElement('div');
        divVenta.classList.add('tarjeta-venta');
        tarjetasCompraVenta.appendChild(divVenta);

        const inputCantidadPesos = document.createElement('input');
        inputCantidadPesos.setAttribute('type', 'number');
        inputCantidadPesos.setAttribute('id', 'cantidad-pesos');
        inputCantidadPesos.setAttribute('placeholder', 'Ingrese la cantidad de pesos argentinos a vender');
        divVenta.appendChild(inputCantidadPesos);

        const btnConvertir = document.createElement('button');
        btnConvertir.textContent = 'Convertir';
        btnConvertir.classList.add('convertir-btn');
        divVenta.appendChild(btnConvertir);

        const historialVentaDiv = document.createElement('div');
        historialVentaDiv.classList.add('historial');
        divVenta.appendChild(historialVentaDiv);

        btnConvertir.addEventListener('click', function () {
            const cantidadPesos = inputCantidadPesos.value;
            const resultadoDivisas = [];

            divisas.forEach(function (divisa) {
                const cantidadDivisa = cantidadPesos / divisa.valorBlue;
                resultadoDivisas.push(`Recibirás ${cantidadDivisa.toFixed(2)} ${divisa.nombre}`);
            });

            historialVentaDiv.innerHTML = resultadoDivisas.join("<br>");
            guardarConversionEnHistorial(cantidadPesos, resultadoDivisas.join("<br>"));
        });
    }

    function guardarConversionEnHistorial(cantidadPesos, resultado) {
        const historialGuardado = localStorage.getItem('historialConversiones');
        let historialConversiones = [];

        if (historialGuardado) {
            historialConversiones = JSON.parse(historialGuardado);
        }

        historialConversiones.push({
            cantidadPesos: cantidadPesos,
            resultado: resultado,
        });

        localStorage.setItem('historialConversiones', JSON.stringify(historialConversiones));
    }

    function cerrarCalculadoraVenta() {
        if (divVenta) {
            divVenta.remove();
        }
    }

    const urlLocal = './divisas.json';

    fetch(urlLocal)
        .then(response => response.json())
        .then(data => {
            divisas = data.divisas;
        })
        .catch(error => {
            mostrarMensajeError('Error al obtener las divisas', error);
        });
});

function mostrarMensajeError(title, error) {
    Swal.fire({
        icon: 'error',
        title: 'ERROR!',
        text: 'Ha ocurrido un error inesperado.',
        confirmButtonText: 'Cerrar',
    });
}
