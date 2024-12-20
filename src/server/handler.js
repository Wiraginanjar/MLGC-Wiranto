const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
 const { storeData, getData } = require('../services/storeData');
 
async function postPredictHandler(request, h) {

  try {
    const { image } = request.payload;
    if (Buffer.byteLength(image, 'base64') > 1024 * 1024) {
      const response = h.response({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000',
      });
      response.code(413);
      return response;
    }
    const { model } = request.server.app;
   
    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
   
    const data = {
      "id": id,
      "result": label,
      "suggestion": suggestion,
      "createdAt": createdAt
    }
  
    await storeData(id, data);
    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data
    })
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi',
    })
    response.code(400);
    return response;
  }
}
async function getHistory(request, h) {
  try {
    const maps = await getData(); 
    console.log(maps);
    
    const response = h.response({
      status: 'success',
      data: maps
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error('Error fetching history:', error); // Log the error for debugging
    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan saat mengambil riwayat prediksi',
    });
    response.code(500);
    return response;
  }
}
 
module.exports = { postPredictHandler, getHistory };