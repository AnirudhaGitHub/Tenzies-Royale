const { updateDoc, getDoc, doc, addDoc, setDoc } = require("firebase/firestore");
const {ethers} = require('ethers')

// Function to update data in Firestore
async function updateOrsetDocument(collectionRef, documentId, newData, setData, idIsAddress = false) {
    try {
      // if(idIsAddress)documentId = ethers.utils.getAddress(documentId);
  
      const docRef = collectionRef.doc(documentId);
      const docSnapshot = await docRef.get();
  
      if (docSnapshot.exists) {
        // Document exists, update its data
        await docRef.update(newData);
      } else {
        await docRef.set(setData);
      }
      console.log(`Document with ID ${documentId} updated successfully!`);
    } catch (error) {
      console.error('Error updating or setting document:', error);
      throw new Error("updateOrsetDocument: failed");
    }
}

// Function to add a new document to a collection
async function addDocument(collectionRef, newData) {
    try {
        const res = await collectionRef.add(newData);
        return res;
    } catch (error) {
        console.error('Error adding document:', error);
        throw new Error("addDocument: failed");
    }
}

module.exports ={
    updateOrsetDocument,
    addDocument
}