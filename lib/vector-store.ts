import { Pinecone } from '@pinecone-database/pinecone';
import { HfInference } from '@huggingface/inference';

// Initialize Pinecone
export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const getPineconeIndex = () => {
  return pinecone.Index(process.env.PINECONE_INDEX_NAME || 'talent-shapers-index');
};

// Initialize Hugging Face Inference
export const hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);

// We use all-MiniLM-L6-v2 which has 384 dimensions
export const EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const output = await hf.featureExtraction({
      model: EMBEDDING_MODEL,
      inputs: text,
    });
    
    // The inference API for feature extraction can sometimes return a nested array.
    // We ensure we return a flat number[] representing the 384 dimensions.
    if (Array.isArray(output) && Array.isArray(output[0])) {
        return output[0] as number[];
    }
    return output as number[];
  } catch (error) {
    console.error('Error generating embedding with HF:', error);
    throw new Error('Failed to generate embedding');
  }
}
