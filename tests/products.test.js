const mongoose = require('mongoose')
const supertest = require('supertest')

const PATHS_PRODUCTS = {
  todos: '/api/products/50/Destacados/10000/0/no-search/false/Todas las categorías',
  tresProductos: '/api/products/3/Destacados/10000/0/no-search/false/Todas las categorías',
  buscarDiscoDuro: '/api/products/50/Destacados/10000/0/disco/false/Todas las categorías',
  buscarProductoFalso: '/api/products/50/Destacados/10000/0/lkajsdfoiej/false/Todas las categorías',
  productosDescuentos: '/api/products/50/Destacados/10000/0/no-search/true/Todas las categorías',
  precioEntre50y100: '/api/products/50/Destacados/100/50/no-search/false/Todas las categorías',
  precioErroneo: '/api/products/50/Destacados/50/100/no-search/false/Todas las categorías'
}

//creamos la api de supertest
const app = require('../app')
const api = supertest(app)

jest.setTimeout(60000);

describe('Products test',  () => {

    test('Pedir todos los productos', async () => {
      const response = await api
        .get(PATHS_PRODUCTS.todos)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body[0].name).toBeDefined()
    })


    test('Pedir 3 productos', async () => {
      const response = await api
        .get(PATHS_PRODUCTS.tresProductos)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body[0].name).toBeDefined()
      expect(response.body.length).toBe(3)
    })


    test('Pruebas del buscador correcto', async () => {
      const response = await api
        .get(PATHS_PRODUCTS.buscarDiscoDuro)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body[0].name).toBeDefined()
      expect(response.body.length).toBe(3)
    })


    test('Pruebas del buscador erroneo', async () => {
      const response = await api
        .get(PATHS_PRODUCTS.buscarProductoFalso)
        .expect('Content-Type', /application\/json/)
      expect(response.body[0].error).toBeDefined()
    })


    test('Pedir productos con descuento', async () => {
      const response = await api
        .get(PATHS_PRODUCTS.productosDescuentos)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body[0].name).toBeDefined()
      expect(response.body[0].sale).toBe(true)
    })
    
    test('Precio entre 50 y 100 €', async () => {
      const response = await api
        .get(PATHS_PRODUCTS.precioEntre50y100)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body[0].name).toBeDefined()
      expect(response.body[0].price >= 50 && response.body[0].price <= 100)
    })


    test('Precio entre 50 y 100 € erroneo', async () => {
      const response = await api
        .get(PATHS_PRODUCTS.precioErroneo)
        .expect('Content-Type', /application\/json/)
      expect(response.body[0].error).toBeDefined()
    })


    test('Pedir un producto correcto', async () => {
      const products = await api
        .get(PATHS_PRODUCTS.todos)

      const response = await api
        .get(`/api/product/${products.body[0].id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.name).toBe(products.body[0].name)
    })


    test('Pedir un producto erroneo', async () => {
      const response = await api
        .get('/api/product/idfalso')
        .expect(500)
        .expect('Content-Type', /application\/json/)

      expect(response.body.error).toBeDefined()
    })


    test('Añadir valoración correcta', async () => {
        const valoration = {
            username: "usuario_prueba",
            text: "",
            stars: 5
        }

        const products = await api
        .get(PATHS_PRODUCTS.todos)

        await api
          .put(`/api/product/${products.body[0].id}`)
          .send(valoration)
          .expect(200)
          .expect('Content-Type', /application\/json/)
    })


    test('Añadir valoración incorrecta', async () => {
      const valoration = {
        username: "usuario_prueba",
        text: "",
        stars: 5
      }

      await api
        .put('/api/product/noexiste')
        .send(valoration)
        .expect(500)
        .expect('Content-Type', /application\/json/)
    })
})
  
//cuando acabamos cerramos la conexión con la base de datos.
afterAll(async () => {
await mongoose.connection.close()
})