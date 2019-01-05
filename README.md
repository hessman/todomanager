# TODO MANAGER

**NodeJS Exercice**


Creation of a simple MVC todo list manager with *no client-side javascript*.


It handles **users**, **todos** and **sessions**.

I used Sequelize and SQLite.

I did not use express-session. My session class was enough for my needs.


Just run `npm install` and go to http://localhost:8080 the database is initialized it works without any migrations.

You can use the migration to re-initialize the database :
* just `node_modules/.bin/sequelize db:migrate` to migrate the database. 
* and `node_modules/.bin/sequelize db:migrate:undo:all` to undo.

