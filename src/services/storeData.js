const { Firestore } = require('@google-cloud/firestore');
 
async function storeData(id, data) {
  const db = new Firestore({databaseId: "(default)" });
 
  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}
async function getData() {
  const db = new Firestore({databaseId: "(default)" });
 
  const history = await db.collection('predictions').get();
  const result = history.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,  // Menggunakan ID dokumen Firestore sebagai ID riwayat
      history: {
        result: data.result,
        createdAt: data.createdAt,
        suggestion: data.suggestion,
        id: doc.id,  // Menyimpan ID dokumen di dalam 'history'
      }
    };
  });
  return result;
}
 
module.exports = { storeData, getData };