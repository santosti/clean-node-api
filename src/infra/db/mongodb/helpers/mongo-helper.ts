import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
  },
  async disconnect(): Promise<void> {
    this.client.close();
  },
  getConnection(name: string): Collection {
    return this.client.db().collection(name);
  },
  async removeAll(collection: string): Promise<void> {
    await this.getConnection(collection).deleteMany({});
  },
};
