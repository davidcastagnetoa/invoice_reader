import { config } from "../src/config/config.js";
import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: config.openaiApiKey,
});
const openai = new OpenAIApi(configuration);

const testOpenAI = async () => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "developer", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "Write a haiku about recursion in programming.",
        },
      ],
      temperature: 1,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error al llamar a la API de OpenAI:", error);
  }
};

testOpenAI();
