import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper';
import env from './config/env';

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    // Garante que o app só seja importado e utlizado depois que o mongo connectar
    const app = (await import('./config/app')).default;
    app.listen(env.port, () =>
      console.log(`Server is running at ${env.mongoUrl}:${env.port}`)
    );
  })
  .catch(console.error);
