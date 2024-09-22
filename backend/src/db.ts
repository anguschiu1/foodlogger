import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false, // Disable all logging
});
(async () => {
  sequelize.sync({ force: true });
})();

export default sequelize;
