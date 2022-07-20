import fs from "fs";

export default class Contenedor {
	constructor(rutaArchivo){
		this.rutaArchivo = rutaArchivo;
	}

	async read(){
		try{
			let contenido = await fs.promises.readFile(this.rutaArchivo, 'utf-8');
			contenido = JSON.parse(contenido);
			return contenido;
		}catch(error){
			console.log(`No se puede leer el archivo: ${error}`);
			return [];
		}
	}

	async save(objeto){
		try{
			let contenido = Object.values(await this.read());
			let maxId = (contenido.length > 0) ? Math.max(...contenido.map(item => item.id)) : 0;			
			objeto.id = maxId + 1;			
			contenido.push(objeto);
			await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(contenido, null, '\t'));
			return objeto.id;
		}catch(error){
			console.log(`No se puede guardar el archivo: ${error}`);
		}
	}

	async getById(id){
		try{
			let contenido = Object.values(await this.read());
			let encontrado = contenido.find(x => x.id === id);
			return (encontrado !== undefined) ? encontrado : null;
		}catch(error){
			console.log(`Ocurrió un error al obtener el objeto del archivo: ${error}`);
		}
	}

	async getAll(){
		try{
			let contenido = Object.values(await this.read());
			return contenido;
		}catch(error){
			console.log(`Ocurrió un error al obtener los objetos del archivo: ${error}`);
			return [];
		}
	}

	async deleteById(id){
		try{
			let contenido = Object.values(await this.read());
			let objetoIndex = contenido.findIndex(x => x.id === id);
			if (objetoIndex > -1) {
				contenido.splice(objetoIndex, 1);
				await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(contenido, null, '\t'));
			}
		}catch(error){
			console.log(`Ocurrió un error al eliminar el objeto del archivo: ${error}`);
		}
	}

	async deleteAll(){
		try{
			await fs.promises.writeFile(this.rutaArchivo, JSON.stringify([], null, '\t'));
		}catch(error){
			console.log(`Ocurrió un error al eliminar los objetos del archivo: ${error}`);
		}
	}

	async delete(){
		try{
			await fs.promises.unlink(this.rutaArchivo);		
		}catch(error){
			console.log(`No se puede borrar el archivo: ${error}`);
		}
	}
}