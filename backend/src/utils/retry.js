function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retry(fn, retries = 10, delay = 3000) {
    //console.log('Retry helper iniciado')
  for (let i = 0; i < retries; i++) {
    try {
        //console.log(`Tentativa ${i + 1}/${retries}`);
      return await fn();
    } catch (error) {
      console.log(`Tentativa ${i + 1} falhou: ${error.message}`);
      console.log(`A aguardar ${delay}ms...`);
      await wait(delay);
    }
  }

  throw new Error('Falhou após várias tentativas');
}

module.exports = retry;