//función para formatear un documento de mongo
function formatDocumentOne(doc){
    const response = {...doc}._doc
    //creamos un objeto con los valores de doc y le añadimos el campo virtual stars
    response.stars = doc.stars
    response.id = doc._id
    return response
}


//función para formatear documentos de mongo
function formatDocuments(documents){
    return documents.map(d => formatDocumentOne(d))
}

module.exports = {formatDocumentOne, formatDocuments}