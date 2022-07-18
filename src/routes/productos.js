import express from "express";
import Productos from "../services/productos.js";

const router = express.Router();
const productsService = new Productos();

router.get('/', (req, res) => {
	let products = productsService.getAllProducts();	
	if (products.length == 0) return res.send({error: "No hay productos cargados"});
	res.send(products);
});

router.get('/:id', (req, res) => {
	let {id} = req.params;
	let product = productsService.getProductById(id);
	if (!product) return res.send({error: "Producto no encontrado"});
	res.send(product);
});

router.post('/', (req, res) => {
	let {title, price, thumbnail} = req.body;
	let id = productsService.getNextId();
	let product = {id, title, price, thumbnail};
	productsService.saveProduct(product);
	res.send({
		message: "Producto agregado con exito", 
		product: product
	});
});

router.put('/:id', (req, res) => {
	let id = parseInt(req.params.id);
	let {title, price, thumbnail} = req.body;
	let resUpdate = productsService.updateProduct({id, title, price, thumbnail});
	if(resUpdate == null) return res.send({error: "El producto no existe"});
	res.send({message: "Producto actualizado con exito"});
});

router.delete('/:id', (req, res) => {
	let id = parseInt(req.params.id);
	let resDelete = productsService.deleteProduct(id);
	if(resDelete == null) return res.send({error: "El producto no existe"});
	res.send({message: "Producto eliminado con exito"});
});

export default router;