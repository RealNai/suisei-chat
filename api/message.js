import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const request = req.body.messages;
  try {
    const descriptionPath = path.join(process.cwd(), "suisei_description.txt");
    const description = await fs.readFile(descriptionPath, { encoding: "utf8" });
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: description }].concat(request),
      model: "gpt-4o-mini",
    });
    res.status(200).send({ message: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error processing request: ${request}`);
  }
}
