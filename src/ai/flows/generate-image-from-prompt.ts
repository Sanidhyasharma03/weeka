// This file is machine-generated - do not edit!

'use server';

/**
 * @fileOverview Image generation flow from a text prompt.
 *
 * - generateImageFromPrompt - A function that generates an image based on a text prompt.
 * - GenerateImageFromPromptInput - The input type for the generateImageFromPrompt function.
 * - GenerateImageFromPromptOutput - The return type for the generateImageFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { saveImage, type ImageRecord } from '@/lib/firestore';

const GenerateImageFromPromptInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the image from.'),
  userId: z.string().describe('The ID of the user generating the image.'),
  seed: z.number().optional().describe('The seed to use for the image generation.'),
  size: z
    .enum(['256x256', '512x512', '1024x1024'])
    .optional()
    .describe('The size of the image to generate.'),
  safetySettings:
    z
      .array(
        z.object({
          category: z.enum([
            'HARM_CATEGORY_HATE_SPEECH',
            'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            'HARM_CATEGORY_HARASSMENT',
            'HARM_CATEGORY_DANGEROUS_CONTENT',
            'HARM_CATEGORY_CIVIC_INTEGRITY',
          ]),
          threshold: z.enum([
            'BLOCK_LOW_AND_ABOVE',
            'BLOCK_MEDIUM_AND_ABOVE',
            'BLOCK_ONLY_HIGH',
            'BLOCK_NONE',
          ]),
        })
      )
      .optional()
      .describe('Safety settings for the image generation.'),
});

export type GenerateImageFromPromptInput = z.infer<
  typeof GenerateImageFromPromptInputSchema
>;

const GenerateImageFromPromptOutputSchema = z.object({
  media: z
    .string()
    .describe(
      'The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  firestoreId: z.string().describe('The ID of the document in Firestore.'),
});

export type GenerateImageFromPromptOutput = z.infer<
  typeof GenerateImageFromPromptOutputSchema
>;

export async function generateImageFromPrompt(
  input: GenerateImageFromPromptInput
): Promise<GenerateImageFromPromptOutput> {
  return generateImageFromPromptFlow(input);
}

const generateImageFromPromptFlow = ai.defineFlow(
  {
    name: 'generateImageFromPromptFlow',
    inputSchema: GenerateImageFromPromptInputSchema,
    outputSchema: GenerateImageFromPromptOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      prompt: input.prompt,
      model: 'googleai/imagen-4.0-fast-generate-001',
      config: {
        seed: input.seed,
        // safetySettings: input.safetySettings, // Safety settings cause errors.
      },
    });

    const imageDataUri = media.url!;
    
    // Save metadata and image data URI to Firestore
    const imageRecord: ImageRecord = {
      userId: input.userId,
      prompt: input.prompt,
      imageData: imageDataUri, // Storing data URI directly
      createdAt: Date.now(),
    };
    const firestoreId = await saveImage(imageRecord);

    return {media: imageDataUri, firestoreId};
  }
);
