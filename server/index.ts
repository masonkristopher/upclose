import dotenv from 'dotenv';
import sequelize from './db/index';
import { initUser } from './db/models/user';
import { initParty, associatePartyMessages, associateIdCreator } from './db/models/party';
import { initMessage, associateMessage } from './db/models/message';
import { initUserParty, associateUserParty } from './db/models/userParty';
import server from './refactorApp';

dotenv.config();

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);

  // connect sequelize
  sequelize.authenticate()
    .then(() => {
      console.log('Connected to database!');
    })
    .catch((error) => {
      console.error('Unable to connect to the database:', error);
    });

  // init models and associations
  initUser(sequelize);
  initParty(sequelize);
  initMessage(sequelize);
  initUserParty(sequelize);
  associateUserParty();
  associatePartyMessages();
  associateMessage();
  associateIdCreator();
  // sequelize.sync({ force: true }); // if you need to drop the tables
  sequelize.sync(); // if you just need to update the tables
});
