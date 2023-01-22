const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const axios = require('axios')

jest.setTimeout(60000);

describe('Products test',  () => {

    const url = "http://127.0.0.1:4000/graphql/"

    function makeQuery(query){
        const request = axios.post(url, query)
        return request.then(response => response.data)
    }

  
    test('Pedir todos los productos', async () => {
      const query = {
        "query":"query { getProducts{ __typename ... on Product {name}... on Error {error} } }"
      }

      const response = await makeQuery(query)
      expect(response.data.getProducts[0].name).toBeDefined()
    })


    test('Pedir 3 productos', async () => {
        const query = {
          "query":"query { getProducts(amount: 3){ __typename ... on Product {name}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.getProducts[0].name).toBeDefined()
        expect(response.data.getProducts.length).toBe(3)
    })


    test('Pruebas del buscador correcto', async () => {
        const query = {
          "query":"query { getProducts(search: \"Disco\"){ __typename ... on Product {name}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.getProducts[0].name).toBeDefined()
    })


    test('Pruebas del buscador erroneo', async () => {
        const query = {
          "query":"query { getProducts(search: \"asdfasdf\"){ __typename ... on Product {name}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.getProducts[0].error).toBeDefined()
    })


    test('Pedir productos con descuento', async () => {
        const query = {
          "query":"query { getProducts(sale: true){ __typename ... on Product {sale}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.getProducts[0].sale).toBe(true)
    })


    test('Filtrar por categorías correcta', async () => {
        const query = {
          "query":"query { getProducts(category: \"Tecnología\"){ __typename ... on Product {name}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.getProducts[0].name).toBeDefined()
    })


    test('Filtrar por categorías erronea', async () => {
        const query = {
          "query":"query { getProducts(category: \"asdf\"){ __typename ... on Product {name}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.getProducts[0].error).toBeDefined()
    })

    
    test('Filtrar por precio mas alto', async () => {
        const query = {
          "query":"query { getProducts(order: \"Precio más alto\"){ __typename ... on Product {price}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.getProducts[0].price > response.data.getProducts[1].price)
    })


    test('Filtrar por precio mas bajo', async () => {
        const query = {
          "query":"query { getProducts(order: \"Precio más bajo\"){ __typename ... on Product {price}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.getProducts[0].price < response.data.getProducts[1].price)
    })


    test('Filtrar por valoración', async () => {
        const query = {
          "query":"query { getProducts(order: \"Valoración\"){ __typename ... on Product {stars}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.getProducts[0].stars > response.data.getProducts[1].stars)
    })


    test('Precio entre 50 y 100 €', async () => {
        const query = {
          "query":"query { getProducts(price: [100,50]){ __typename ... on Product {price}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.getProducts[0].price >= 50 && response.data.getProducts[0].price <= 100)
    })


    test('Precio entre 50 y 100 € erroneo', async () => {
        const query = {
          "query":"query { getProducts(price: [50,100]){ __typename ... on Product {price}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.getProducts[0].error).toBeDefined()
    })


    test('Pedir un producto correcto', async () => {
        const query = {
          "query":"query { getProductOne(ident: \"63c722826668daae40c4fd3d\"){ __typename ... on Product {name}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.getProductOne.name).toBeDefined()
    })


    test('Pedir un producto erroneo', async () => {
        const query = {
          "query":"query { getProductOne(ident: \"63c722826668daae40a4fd3d\"){ __typename ... on Product {name}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.getProductOne.error).toBeDefined()
    })


    test('Añadir valoración correcta', async () => {
        const query = {
            "query":"mutation { addValoration(ident: \"63c722826668daae40c4fd3d\", username: \"manoloLama\", text: \"Valoración de prueba\", stars: 5){ __typename ... on Product {name}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.addValoration.name).toBeDefined()
    })


    test('Añadir valoración incorrecta', async () => {
        const query = {
            "query":"mutation { addValoration(ident: \"63c722826668saae40c4fd3d\", username: \"manoloLama\", text: \"Valoración de prueba\", stars: 5){ __typename ... on Product {name}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.errors).toBeDefined()
    })
})
  
//cuando acabamos cerramos la conexión con la base de datos.
afterAll(async () => {
await mongoose.connection.close()
})