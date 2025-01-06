import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY!);

// Function to validate base64 image
function isValidBase64Image(imageData: string): boolean {
  try {
    if (!imageData.startsWith('data:image/')) return false;

    const base64 = imageData.split(',')[1];
    if (!base64) return false;

    const sizeInBytes = (base64.length * 3) / 4;
    return sizeInBytes < 4 * 1024 * 1024; // 4MB limit
  } catch {
    return false;
  }
}

export async function analyzeImage(imageData: string): Promise<{ title: string; solution: string }> {
  try {
    if (!isValidBase64Image(imageData)) {
      throw new Error('Invalid image data');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are a helpful assistant. Analyze the provided image data and:
      1. Provide a meaningful and concise title describing the main academic topic, question, or content in the image.
      2. Provide a detailed step-by-step explanation of the problem or question, if applicable.
      Use this format for your response:
      ---
      Title: <A meaningful title summarizing the content>
      Solution:
      <Detailed step-by-step explanation>
      ---
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData.split(',')[1],
          mimeType: 'image/jpeg',
        },
      },
    ]);

    const response = await result.response;

    // Extract title and solution using predefined markers
    const text = response.text();
    const titleMatch = text.match(/Title:\s*(.+)/i);
    const solutionMatch = text.match(/Solution:\s*([\s\S]+)/i);

    const title = titleMatch ? titleMatch[1].trim() : "Image Analysis Result";
    const solution = solutionMatch ? solutionMatch[1].trim() : "Solution not found.";

    return {
      title,
      solution,
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      title: 'Error',
      solution: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
    };
  }
}


// New function to process recognized text
export async function analyzeText(text: string): Promise<string> {
  try {
    const prompt = "You are a helpful teaching assistant. Please provide a clear, step-by-step solution to this academic question: " + text;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([prompt]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing text:', error);
    return `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`;
  }
}
