const {ethers} = require('ethers')

const getAllDocument = async (collectionRef) => {
    try {
      const querySnapshot = await collectionRef.get();
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          data: doc.data()
        });
      });
  
      return documents;
    } catch (error) {
      console.error('getAllDocument: Failed with error:', error);
      throw new Error('getAllDocument: Failed');
    }
  };

const getDocument = async (collectionRef, documentId, isCheckSumDoc = false) => {
    try {
      // if(isCheckSumDoc == true)documentId = ethers.utils.getAddress(documentId); // Transform ID if needed
  
      const docSnapshot = await collectionRef.doc(documentId).get();
      
      if (docSnapshot.exists) {
        return {
          exist: true,
          doc: docSnapshot.data()
        };
      } else {
        return { exist: false, doc: null };
      }
    } catch (error) {
      console.error('getDocument: Failed with error:', error);
      throw new Error('getDocument: Failed');
    }
  };

module.exports ={
    getAllDocument,
    getDocument
}