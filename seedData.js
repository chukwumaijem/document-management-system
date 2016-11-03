const roleData = [
    { title: 'Admin' },
    { title: 'User' }
  ],
  userData = [
    { username: 'ebuka', firstName: 'Ebuka', lastName: 'Akubuike', email: 'ebuka@akubu.com', password: 'ebukaakubu', RoleId: '1' },
    { username: 'emeka', firstName: 'Emeka', lastName: 'Anaku', email: 'emeka@aanu.com', password: 'emekaanaku', RoleId: '2' },
    { username: 'adaobi', firstName: 'Adaobi', lastName: 'Mmadu', email: 'adaobi@mma.com', password: 'mmaduada', RoleId: '2' },
    { username: 'Mmali', firstName: 'Omali', lastName: 'Sinna', email: 'sinna@omali.com', password: 'omalicha', RoleId: '2' },
  ],
  documentData = [
    { title: 'Secret file', content: 'This is a really confidential file..', RoleId: '1', ownerId: '1' },
    { title: 'Another day in paradise', content: 'But seriously, Phil Collins.', public: false, RoleId: '2', ownerId: '2' },
    { title: 'Captian America', content: 'Winter soldier is good, but then there is civil war to consider.', RoleId: '2', ownerId: '3' },
    { title: 'Rising stars', content: 'Thats funny. I didn\'t know they fell before.', public: true, RoleId: '2', ownerId: '2' },
    { title: 'Rise of planet apes', content: 'Just a movie about apes, nothing much.', RoleId: '2', ownerId: '2' },
    { title: 'Frozen', content: 'You only see what your eyes want to see.', public: true, RoleId: '2', ownerId: '3' },
    { title: 'Amazing grace', content: 'Unrelenting grace that wont let go.', RoleId: '2', ownerId: '4' },
    { title: 'Here as in heaven', content: 'A miracle can happen now, for the spirit of...', RoleId: '2', ownerId: '4' }
  ];

module.exports = function (models) {

  models.Role.bulkCreate(roleData)
    .then(function () {
      console.log('User start');
      models.User.bulkCreate(userData, { individualHooks: true })
        .then(function () {
          console.log('Document start');
          models.Document.bulkCreate(documentData);
          console.log('Document finished');
        }).catch((err) => {
          console.log(err.message);
        })
    }).catch((err) => {
      console.log(err.message);
    });

};