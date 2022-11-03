import { MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGODB_URL);
  },
  async disconnect(): Promise<void> {
    this.client.close();
  },
};
