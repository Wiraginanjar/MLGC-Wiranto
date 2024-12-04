const tf = require('@tensorflow/tfjs-node');

 
async function predictClassification(model, image) {
    const tensor = tf.node
    .decodeJpeg(image)
    .resizeBilinear([224, 224])
    .expandDims(0)
    .div(255.0);

  const prediction = model.predict(tensor);
 
  const Result = prediction.dataSync()[0];
 
  let suggestion;

  const threshold = 0.58
 
  if (Result > threshold) {
    label  = "Cancer"
    suggestion = "Segera periksa ke dokter!"
  } else {
    label  = "Non-cancer"
    suggestion = "Penyakit kanker tidak terdeteksi."
  }
 
  return { label, suggestion };
}  
 
module.exports = predictClassification;