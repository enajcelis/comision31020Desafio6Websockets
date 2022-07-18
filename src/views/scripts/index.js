let socket = io();
let email = document.getElementById('email');
let log = document.getElementById('log');
let form = document.getElementById('addProductForm');
let divProductos = document.getElementById('productos');

/* LISTADO INICIAL DE PRODUCTOS */
(function() {
	fetch('/api/productos',{ 
		method: 'GET', 
		headers: {
			"Content-Type": "application/json"
		} 
	})
	.then(response => response.json())
	.then(data => {
		let listProducts = `
		<div class="row">
			<table class="table table-dark table-responsive">
				<thead>
					<tr>
						<th scope="col">Nombre</th>
						<th scope="col">Precio</th>
						<th scope="col">Foto</th>
					</tr>
				</thead>
				<tbody>
		`;
		data.forEach(producto => {
			listProducts = listProducts + `
			<tr>
				<td>${producto.title}</td>
				<td>$${producto.price}</td>
				<td>
					<a href="${producto.thumbnail}" target="_blank">
						<img src="${producto.thumbnail}" class="rounded img-thumbnail" style="width: 200px">
					</a>
				</td>
			</tr>
			`;
		});
		divProductos.innerHTML = listProducts + `
				</tbody>
			</table>
		</div>`;						
	});			
})();

/* EVENTOS DE SOCKETS */
socket.on('producto', data => {	
	let listProducts = `
	<div class="row">
		<table class="table table-dark table-responsive">
			<thead>
				<tr>
					<th scope="col">Nombre</th>
					<th scope="col">Precio</th>
					<th scope="col">Foto</th>
				</tr>
			</thead>
			<tbody>
	`;
	data.forEach(producto => {
		listProducts = listProducts + `
		<tr>
			<td>${producto.title}</td>
			<td>$${producto.price}</td>
			<td>
				<a href="${producto.thumbnail}" target="_blank">
					<img src="${producto.thumbnail}" class="rounded img-thumbnail" style="width: 200px">
				</a>
			</td>
		</tr>
		`;
	});
	divProductos.innerHTML = listProducts + `
			</tbody>
		</table>
	</div>`;
});

socket.on('log', data => {	
	let messages = "";
	data.forEach(log => {
		messages = messages + `
			<p>
				<span style="color:blue"><strong>${log.user}</strong></span>
				<span style="color:brown">[${log.date} ${log.time}]</span> : 
				<span style="color:green">${log.message}</span>
			</p>							
		`;
	});
	log.innerHTML = messages;
});

/* EVENTOS DEL CHAT */
chatBox.addEventListener('keyup', evt => {
	if(evt.key === "Enter"){
		if(email.value.trim().length > 0){	
			if(chatBox.value.trim().length > 0){
				socket.emit('message', {
					user: email.value.trim(), 
					message: chatBox.value.trim(), 
					date: moment().format('DD/MM/YYYY'), 
					time: moment().format('HH:mm')
				});
				chatBox.value = "";
			}
		}else{
			chatBox.value = "";

			/* ALERT EMAIL */
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: '¡Necesitas escribir tu correo electrónico para participar!',
			});
		}							
	}
});

/* EVENTOS DE PRODUCTOS */
form.addEventListener('submit', (evt) => { 
	evt.preventDefault(); 
	let data = new FormData(form);
	let obj = {};
	data.forEach((value,key) => obj[key] = value); 
	
	// Post producto
	fetch('/api/productos',{ 
		method: 'POST', 
		body: JSON.stringify(obj),
		headers: {
			"Content-Type": "application/json"
		} 
	})
	.then(response => response.json())
	.then(data => {
		socket.emit('newProduct', {
			id: data.product.id,
			title: data.product.title, 
			price: data.product.price, 
			thumbnail: data.product.thumbnail, 
		});

		form.reset();
	});
});