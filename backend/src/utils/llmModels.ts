import { GoogleGenerativeAI } from "@google/generative-ai";
import { googleAi } from "../config";
import { rolePrompt } from "../prompts/rolePrompts";

const genAI = new GoogleGenerativeAI(googleAi.apiKey);
const model = genAI.getGenerativeModel({ model: googleAi.model });

export const geminiModel = async (
  userQuery: string,
  code:
    | []
    | {
        filechunkInfo: {
          endLine: number;
          startLine: number;
          filePath: string;
        };
        fileChunk: string;
      }[]
) => {
  // const fullPrompt = `${rolePrompt}\n\n${userQuery}\n\n${code}`;

  const codeString = code
    .map(
      (chunk) =>
        `File Path: ${chunk.filechunkInfo.filePath}\nLines ${chunk.filechunkInfo.startLine}-${chunk.filechunkInfo.endLine}:\n${chunk.fileChunk}`
    )
    .join("\n\n");

  const fullPrompt = `your role:\n${rolePrompt}\n\nCode:\n${codeString}\n user query:\n${userQuery}`;

  const result = await model.generateContent(fullPrompt);
  return result.response.text();
};
