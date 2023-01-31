const mongoose = require('mongoose')
const supertest = require('supertest')

//creamos la api de supertest
const app = require('../app')
const api = supertest(app)

jest.setTimeout(60000);

describe('Products test',  () => {

    test('Pedir todos los productos', async () => {
      const response = await api
        .get('/api/products/50/Destacados/10000/0/no-search/false')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body[0].name).toBeDefined()
    })


    test('Pedir 3 productos', async () => {
      const response = await api
        .get('/api/products/3/Destacados/10000/0/no-search/false')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body[0].name).toBeDefined()
      expect(response.body.length).toBe(3)
    })


    test('Pruebas del buscador correcto', async () => {
      const response = await api
        .get('/api/products/50/Destacados/10000/0/disco/false')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body[0].name).toBeDefined()
      expect(response.body.length).toBe(3)
    })


    test('Pruebas del buscador erroneo', async () => {
      const response = await api
        .get('/api/products/50/Destacados/10000/0/lkajsdfoiej/false')
        .expect('Content-Type', /application\/json/)
      expect(response.body[0].error).toBeDefined()
    })


    test('Pedir productos con descuento', async () => {
      const response = await api
        .get('/api/products/50/Destacados/10000/0/no-search/true')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body[0].name).toBeDefined()
      expect(response.body[0].sale).toBe(true)
    })
    
    test('Precio entre 50 y 100 €', async () => {
      const response = await api
        .get('/api/products/50/Destacados/100/50/no-search/false')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body[0].name).toBeDefined()
      expect(response.body[0].price >= 50 && response.body[0].price <= 100)
    })


    test('Precio entre 50 y 100 € erroneo', async () => {
      const response = await api
        .get('/api/products/50/Destacados/50/100/no-search/false')
        .expect('Content-Type', /application\/json/)
      expect(response.body[0].error).toBeDefined()
    })


    test('Pedir un producto correcto', async () => {
      const response = await api
        .get('/api/product/63c722826668daae40c4fd3c')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.name).toBe("Levi's 512™ Slim Taper Vaqueros Hombre")
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

        await api
          .put('/api/product/63c722826668daae40c4fd3c')
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