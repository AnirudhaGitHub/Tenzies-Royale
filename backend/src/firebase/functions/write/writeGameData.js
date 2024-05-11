const {db} = require('../../config')
const {updateOrsetDocument, AddDocument} = require('../../common/writeData')

const tenziesCollection = db.collection("tenzies");

const updateGameOf = async (documentId, setData) => {
    try {
        await updateOrsetDocument(tenziesCollection, documentId, setData, setData)
        
    } catch (err) {
        console.error(err);
        throw new Error('updateGameOf: failed')
    }
};

module.exports ={
    updateGameOf
}
