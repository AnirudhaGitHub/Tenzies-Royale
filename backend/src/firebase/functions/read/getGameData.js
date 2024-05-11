// const { collection } = require("firebase/firestore");
const {db} = require('../../config')
const {getAllDocument, getDocument} = require('../../common/getData')

const tenziesCollection = db.collection("tenzies");

const getAllData = async (chainId) => {
    try {
        const data = await getAllDocument(tenziesCollection)
        return data
    } catch (err) {
        console.error(err);
        return []
    }
};

const getGameOfDoc = async (documentId) => {
    try {
        const data = await getDocument(tenziesCollection, documentId)
        return data
    } catch (err) {
        console.error(err);
        throw new Error('getGameOfDoc: failed')
    }
};

module.exports ={
    getGameOfDoc,
    getAllData
}