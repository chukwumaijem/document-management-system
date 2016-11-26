import Logger from './tracer';

const moment = require('moment');

const roleData = [
  { title: 'Admin' },
  { title: 'User' }
];
const userData = [
  { username: 'ebuka', firstName: 'Ebuka', lastName: 'Akubuike', email: 'ebuka@akubu.com', password: 'ebukaakubu', RoleId: '1' },
  { username: 'emeka', firstName: 'Emeka', lastName: 'Anaku', email: 'emeka@aanu.com', password: 'emekaanaku', RoleId: '2' },
  { username: 'adaobi', firstName: 'Adaobi', lastName: 'Mmadu', email: 'adaobi@mma.com', password: 'mmaduada', RoleId: '2' },
  { username: 'Mmali', firstName: 'Omali', lastName: 'Sinna', email: 'sinna@omali.com', password: 'omalicha', RoleId: '2' },
];
const documentData = [
  {
    title: 'Secret file', content: 'This is a really confidential file..', RoleId: '1', ownerId: '1',
    createdAt: moment().add(-10, 'seconds').utc().format(), updatedAt: moment().add().utc().format()
  },
  {
    title: 'Another day in paradise', content: 'But seriously, Phil Collins.', public: false, RoleId: '2', ownerId: '2',
    createdAt: moment().add(-9, 'seconds').utc().format(), updatedAt: moment().add().utc().format()
  },
  {
    title: 'Captian America', content: 'Winter soldier is good, but then there is civil war to consider.', RoleId: '2', ownerId: '3',
    createdAt: moment().add(-8, 'seconds').utc().format(), updatedAt: moment().add().utc().format()
  },
  {
    title: 'Rising stars', content: 'Thats funny. I didn\'t know they fell before.', public: true, RoleId: '2', ownerId: '2',
    createdAt: moment().add(-7, 'seconds').utc().format(), updatedAt: moment().add().utc().format()
  },
  {
    title: 'Rise of planet apes', content: 'Just a movie about apes, nothing much.', RoleId: '2', ownerId: '2',
    createdAt: moment().add(-6, 'seconds').utc().format(), updatedAt: moment().add().utc().format()
  },
  {
    title: 'Frozen', content: 'You only see what your eyes want to see.', public: true, RoleId: '2', ownerId: '3',
    createdAt: moment().add(-5, 'seconds').utc().format(), updatedAt: moment().add().utc().format()
  },
  {
    title: 'Amazing grace', content: 'Unrelenting grace that wont let go.', RoleId: '2', ownerId: '4',
    createdAt: moment().add(-4, 'seconds').utc().format(), updatedAt: moment().add().utc().format()
  },
  {
    title: 'Here as in heaven', content: 'A miracle can happen now, for the spirit of...', RoleId: '2', ownerId: '4',
    createdAt: moment().add(-3, 'seconds').utc().format(), updatedAt: moment().add().utc().format()
  }
];

module.exports = (models) => {
  models.Role.bulkCreate(roleData)
    .then(() => {
      models.User.bulkCreate(userData, { individualHooks: true })
        .then(() => {
          models.Document.bulkCreate(documentData);
        }).catch((err) => {
          Logger.error(err.message);
        });
    }).catch((err) => {
      Logger.error(err.message);
    });
};
