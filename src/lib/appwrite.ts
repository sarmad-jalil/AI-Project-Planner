import { Client, Databases, ID, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
export const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || '';

export async function saveProjectPlan(plan: any, idea: string) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        idea,
        appName: plan.appName || '',
        summary: plan.summary || '',
        targetUsers: JSON.stringify(plan.targetUsers || []),
        coreFeatures: JSON.stringify(plan.coreFeatures || []),
        techStack: JSON.stringify(plan.techStack || []),
        pages: JSON.stringify(plan.pages || []),
        dataModel: JSON.stringify(plan.dataModel || {}),
        buildPhases: JSON.stringify(plan.buildPhases || []),
        risks: JSON.stringify(plan.risks || []),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
    return response;
  } catch (error) {
    console.error('Error saving project plan:', error);
    throw error;
  }
}

export async function getRecentPlans(limitCount = 10) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.limit(limitCount), Query.orderDesc('createdAt')]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching recent plans:', error);
    throw error;
  }
}

export async function getPlanById(documentId: string) {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId
    );
    return response;
  } catch (error) {
    console.error('Error fetching plan:', error);
    throw error;
  }
}
