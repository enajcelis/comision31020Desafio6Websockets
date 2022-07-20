import express from "express";
import {Server} from "socket.io";
import productsRouter from './routes/productos.js';
import ProductosService from "./services/productos.js";
import Contenedor from './contenedor.js';
import path from 'path';
import __dirname from './utils.js';

const app = express();
const PORT =  process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
const io = new Server(server);

let miContenedorLog = new Contenedor('./src/files/log.txt');

app.use((req, res, next) => {
	console.log(`Peticion ${req.method} en ${req.url}`);
	next();
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/static/scripts', express.static(path.join(__dirname, 'static/scripts')));

app.set('views', './src/views');
app.set('view engine', 'ejs');

const productsService = new ProductosService();

// Listado
app.get('/productos', (req, res) => {
	let productos = productsService.getAllProducts();
	res.render('listado', {productos: productos});
});

// Form
app.get('/', (req, res) => {
	res.render('agregar');
});

// Post form
app.post('/productos', (req, res) => {
	let {title, price, thumbnail} = req.body;
	let id = productsService.getNextId();
	let product = {id, title, price, thumbnail};
	productsService.saveProduct(product);
	res.redirect('/');
});

let log = [];
let arrProductos = [];

io.on('connection', socket => {
	socket.on('message', async (data) => {		
		await miContenedorLog.save({
			"user": data.user,
			"message": data.message,
			"date": data.date,
			"time": data.time
		});
		
		log = await miContenedorLog.read();
		io.emit('log', log);
	});
	socket.on('newProduct', data => {
		arrProductos.push(data);
		io.emit('producto', arrProductos);
	});
});

app.use('/api/productos', productsRouter);

// Middleware para las rutas no existentes
app.use((req, res, next) => {
	res.status(404).send({message: `Ruta ${req.url} método ${req.method} no implementada`});
});