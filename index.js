"use strict";
const db = require('./context')();
const server = require('./server')(db);
const PORT = process.env.PORT || 3030;
(async () => {
    await db.sequelize.sync({
        force: false
    });
    /*db.users.create({
        Login : 'nikita',
        Password: 'nIkItA',
        Name : 'Nikita',
        Email : 'niktia@mail.ru',
        Role : 'admin'
    });*/
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})();