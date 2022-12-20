const url = "http://localhost:8080/cuenta/"
const url1 = "http://localhost:8080/cuenta/list"

const contenedor = document.querySelector('tbody')

let resultados = ''

const modalCuentas = new bootstrap.Modal(document.getElementById('modalCuentas'))
const formCuentas = document.querySelector('form')
const idCuenta = document.getElementById('id')
const fechaCuenta = document.getElementById('fecha')
const saldoCuenta = document.getElementById('saldo')
const clienteCuenta = document.getElementById('cliente')

let opcion = ''

btnCrear.addEventListener('click', () => {
    idCuenta.value = ''
    fechaCuenta.value = ''
    saldoCuenta.value = ''
    clienteCuenta.value = ''
    idCuenta.disabled = false
    modalCuentas.show()
    opcion = 'crear'
})

const mostrar = (Cuentas) => {
    Cuentas.forEach(Cuenta => {
        fechaCorta = Cuenta.fecha_apertura
        fechaNueva = fechaCorta.substring(0,10)
        resultados += `<tr>
                        <td >${Cuenta.id_cuenta}</td>
                        <td >${fechaNueva}</td>
                        <td >${Cuenta.saldo_cuenta}</td>
                        <td >${Cuenta.cliente.id_cliente}</td>
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

    alertify.confirm("Desea eliminar la Cuenta "+id,
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
    const saldo = fila.children[2].innerHTML
    const cliente = fila.children[3].innerHTML
    idCuenta.value = idForm
    idCuenta.disabled = true
    fechaCuenta.value = fecha
    saldoCuenta.value = saldo
    clienteCuenta.value = cliente


    opcion = 'editar'
    modalCuentas.show()
})

formCuentas.addEventListener('submit', (e) => {
    e.preventDefault()

        if (opcion == 'crear') {
            fetch(url, {
                method: 'POST',
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
        modalCuentas.hide()
    
})