const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_API_KEY);
const REQUEST_TIMEOUT_MS = 20000;

function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("AI request timed out. Please try again.")), ms)
  );
  return Promise.race([promise, timeout]);
}

async function generateProductDescription(name, category, material, features) {
  const prompt = `You are an expert e-commerce copywriter.

Write a professional product description.

Product Name: ${name}
Category: ${category}
Material: ${material}
Features: ${features}

Maximum 120 words.`;

  const response = await withTimeout(
    client.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    }),
    REQUEST_TIMEOUT_MS
  );

  return response.choices[0].message.content;
}

module.exports = {
  generateProductDescription,
};
