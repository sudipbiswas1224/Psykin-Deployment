// Import the Pinecone library
require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Create a dense index with integrated embedding
const finalyearproject = pc.index('finalyearproject');


//create memory : upserts the vector in the database 
async function createMemory({ messageId, vector, metadata }) {
    console.log('Creating memory request has come')
    if (!Array.isArray(vector) || vector.length === 0) {
        throw new Error('Cannot create memory: embedding vector is empty or invalid.');
    }
    const namespace = String(metadata.user);
    const recordId = String(messageId);
    console.log('Record Id for the vector', recordId);
    // console.log('Creating memory with vector:', vector, 'Message ID:', recordId, 'Namespace user:', namespace);
    try {
        await finalyearproject.namespace(namespace).upsert({
            records: [
                { id: recordId, values: vector, metadata }
            ]
        });
    } catch (error) {
        console.error('Error creating memory:', error);
        throw error;
    }
}

async function queryMemory({ queryVector, limit, metadata, cutoffTimestamp }) {
    if (!Array.isArray(queryVector) || queryVector.length === 0) {
        throw new Error('Cannot query memory: query vector is empty or invalid.');
    }

    const namespace = metadata?.user ? String(metadata.user) : undefined;
    // console.log('Querying memory with vector:', queryVector, 'Limit:', limit, 'Metadata:', metadata);
    const data = await finalyearproject.namespace(namespace).query({
        vector: queryVector,
        topK: limit,
        includeMetadata: true,
        filter: {
            $or: [
                { type: { $eq: 'chat' }, timestamp: { $lt: cutoffTimestamp } },
                { type: { $eq: 'journal' } }
            ]
        }
    })

    return data.matches;

}
module.exports = { createMemory, queryMemory };
