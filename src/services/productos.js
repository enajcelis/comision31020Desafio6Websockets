export default class Productos{
	constructor(){
		this.products = [];
	}

	getAllProducts = () => {
		return this.products;
	}
	
	saveProduct = (product) => {
		this.products.push(product);
	}

	getNextId = () => {
		let products = this.products;
		let maxId = (products.length > 0) ? Math.max(...products.map(item => item.id)) : 0;
		return ++maxId;
	}

	getProductById = (id) => {
		let product = this.products.filter(obj => obj.id === parseInt(id));
		if(product.length == 0) return null;
		return product[0];
	}

	updateProduct = (product) => {
		let productIndex = this.products.findIndex(x => x.id === parseInt(product.id));
		if(productIndex < 0) return null;
		this.products[productIndex] = product;
		return productIndex;
	}

	deleteProduct = (id) => {
		let productIndex = this.products.findIndex(x => x.id === parseInt(id));
		if(productIndex < 0) return null;
		this.products.splice(productIndex, 1);
		return productIndex;
	}
}