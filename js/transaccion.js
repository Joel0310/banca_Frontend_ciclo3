const url = "http://localhost:8080/transaccion/"
const url1 = "http://localhost:8080/transaccion/list"

const contenedor = document.querySelector('tbody')

let resultados = ''

const modalTransacciones = new bootstrap.Modal(document.getElementById('modalTransacciones'))
const formTransacciones = document.querySelector('form')
const idTransaccion = document.getElementById('id')
const fechaTransaccion = document.getElementById('fecha')
const valorTransaccion = document.getElementById('valor')
const tipoTransaccion = document.getElementById('tipo')
const cuentaTransaccion = document.getElementById('cuenta')

let opcion = ''

btnCrear.addEventListener('click', () => {
    idTransaccion.value = ''
    fechaTransaccion.value = ''
    valorTransaccion.value = ''
    tipoTransaccion.value = ''
    cuentaTransaccion.value = ''
    idTransaccion.disabled = false
    modalTransacciones.show()
    opcion = 'crear'
})

const mostrar = (Transacciones) => {
    Transacciones.forEach(Transaccion => {
        fechaCorta = Transaccion.fecha_transaccion
        fechaNueva = fechaCorta.substring(0,10)
        resultados += `<tr>
                        <td >${Transaccion.id_transaccion}</td>
                        <td >${fechaNueva}</td>
                        <td >${Transaccion.valor_transaccion}</td>
                        <td >${Transaccion.tipo_transaccion}</td>
                        <td >${Transaccion.cuenta.id_cuenta}</td>
                        <td class="text-center" width="20%"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
                    </tr>`
    })

    contenedor.innerHTML = resultados
}

fetch(url1)
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(error => console.log(error))

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector))
            handler(e)
    })
}


on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    console.log(id)

    alertify.confirm("Desea eliminar la Transaccion "+id,
        function () {
            fetch(url + id, {
                method: 'DELETE'
            })
                .then(() => location.reload())
        },
        function () {
            alertify.error('Cancel')
        });
})


let idForm = 0
on(document, 'click', '.btnEditar', e => {

    const fila = e.target.parentNode.parentNode
    
    idForm = fila.children[0].innerHTML
    const fecha = fila.children[1].innerHTML
    const valor = fila.children[2].innerHTML
    const tipo = fila.children[3].innerHTML
    const cuenta = fila.children[4].innerHTML
    idTransaccion.value = idForm
    idTransaccion.disabled = true
    fechaTransaccion.value = fecha
    valorTransaccion.value = valor
    tipoTransaccion.value = tipo
    cuentaTransaccion.value = cuenta


    opcion = 'editar'
    modalTransacciones.show()
})

formTransacciones.addEventListener('submit', (e) => {
    e.preventDefault()

        if (opcion == 'crear') {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        id_transaccion: idTransaccion.value,
                        fecha_transaccion: fechaTransaccion.value,
                        valor_transaccion: valorTransaccion.value,
                        tipo_transaccion: tipoTransaccion.value,
                        cuenta: {
                            id_cuenta: cuentaTransaccion.value
                        }
                })
            })
                .then(response => response.json())
                .then(data => {
                    const nuevaCuenta = []
                    nuevaCuenta.push(data)
                    mostrar(nuevaCuenta)
                })
        }
        if (opcion == 'editar') {

            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_cuenta: idCuenta.value,
                    fecha_apertura: fechaCuenta.value,
                    saldo_cuenta: saldoCuenta.value,
                    cliente: {
                        id_cliente:clienteCuenta.value,
                        nombre_cliente:'',
                        clave_cliente:''
                    }
                })
            })
                .then(response => location.reload())

        }
        modalTransacciones.hide()
    
})