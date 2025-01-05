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

// Function to analyze the image
export async function analyzeImage(imageData: string): Promise<string> {
  try {
    if (!isValidBase64Image(imageData)) {
      throw new Error('Invalid image data');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = "You are a helpful teaching assistant. Please analyze this image and provide a clear, step-by-step solution if it contains an academic problem. If it's not an academic problem, politely explain that you can only help with academic questions.";

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
    return response.text();
  } catch (error) {
    console.error('Error analyzing image:', error);
    return `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`;
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
