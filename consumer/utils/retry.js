function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retry(fn, retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
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