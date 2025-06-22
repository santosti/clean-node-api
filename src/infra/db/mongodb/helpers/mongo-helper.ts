import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },
  async disconnect(): Promise<void> {
    this.client.close();
    this.client = null;
  },
  async getConnection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri);
    }
    return this.client.db().collection(name);
  },
  async removeAll(collection: string): Promise<void> {
    await this.getConnection(collection).deleteMany({});
  },
};
