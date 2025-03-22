import OpenAI from 'openai';

// API key from environment variables or fallback to the provided key
const API_KEY = process.env.XAI_API_KEY || 'xai-C2PepxGUGsq8xQZ5zPdRSQwbiDryn9Dg5x9tPTBLt1Pv38YfWTHKGDnWTmwa8lz7GUNspARMJ5XHvmYh';

// Initialize the OpenAI client with X AI configuration
const grokClient = new OpenAI({
  apiKey: API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

/**
 * Types for the Grok AI API responses
 */
export interface GrokCompletionResponse {
  text: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Chat with Grok AI
 * @param prompt - The user's message
 * @param systemPrompt - Optional system prompt to define Grok's behavior
 * @returns The AI's response
 */
export async function chatWithGrok(
  prompt: string,
  systemPrompt: string = 'You are Grok, a helpful AI assistant for the Zafago digital game store. Your goal is to assist customers with their purchases and answer questions about digital products.'
): Promise<string> {
  try {
    const completion = await grokClient.chat.completions.create({
      model: 'grok-2-latest',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || 'I apologize, but I couldn\'t generate a response.';
  } catch (error) {
    console.error('Error chatting with Grok AI:', error);
    return 'Sorry, I encountered an error while processing your request. Please try again later.';
  }
}

/**
 * Generate product recommendations based on user preferences
 * @param userPreferences - User preferences description
 * @param availableProducts - List of available products to recommend from
 * @returns AI-generated recommendations
 */
export async function generateProductRecommendations(
  userPreferences: string,
  availableProducts: string[]
): Promise<string[]> {
  try {
    const productsList = availableProducts.join('\n- ');

    const prompt = `Based on the user preferences: "${userPreferences}", recommend up to 5 products from the following list that would best match their interests. Only provide the product names as a comma-separated list, nothing else.

Available products:
- ${productsList}`;

    const response = await chatWithGrok(prompt);

    // Parse the comma-separated list into an array
    return response
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0 && availableProducts.includes(item));

  } catch (error) {
    console.error('Error generating product recommendations:', error);
    return [];
  }
}

/**
 * Generate a personalized description for a product based on user interests
 * @param productName - The name of the product
 * @param productDescription - The original product description
 * @param userInterests - User interests to tailor the description to
 * @returns Personalized product description
 */
export async function generatePersonalizedDescription(
  productName: string,
  productDescription: string,
  userInterests: string
): Promise<string> {
  try {
    const prompt = `Rewrite the following product description for "${productName}" to appeal specifically to a user interested in ${userInterests}. Keep it under 100 words.

Original description:
${productDescription}`;

    return await chatWithGrok(prompt);
  } catch (error) {
    console.error('Error generating personalized description:', error);
    return productDescription;
  }
}

/**
 * Generate a response to a customer support query
 * @param query - The customer's support query
 * @param storeDetails - Details about the store to help answer appropriately
 * @returns AI-generated support response
 */
export async function generateSupportResponse(
  query: string,
  storeDetails: {
    name: string;
    supportEmail: string;
    refundPolicy: string;
  }
): Promise<string> {
  try {
    const prompt = `As a customer support agent for ${storeDetails.name}, provide a helpful response to the following customer query.
If the query is about refunds, incorporate our refund policy: "${storeDetails.refundPolicy}"
Include our support email (${storeDetails.supportEmail}) if further assistance is needed.

Customer query: "${query}"`;

    return await chatWithGrok(prompt);
  } catch (error) {
    console.error('Error generating support response:', error);
    return `We apologize, but we're having trouble generating a response at the moment. Please contact us directly at ${storeDetails.supportEmail} for assistance with your query.`;
  }
}
