# Document Management System

[![Build Status](https://travis-ci.org/aezumezu/document-management-system.svg?branch=develop)](https://travis-ci.org/aezumezu/document-management-system)   [![Code Climate](https://codeclimate.com/github/aezumezu/document-management-system/badges/gpa.svg)](https://codeclimate.com/github/aezumezu/document-management-system)   [![Coverage Status](https://coveralls.io/repos/github/aezumezu/document-management-system/badge.svg?branch=develop)](https://coveralls.io/github/aezumezu/document-management-system?branch=develop)

The system manages documents, users and user roles. Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date it was published.
This API was built to handle document management. This API would serve as the brains to track, manage and store documents and reduce paper. This API is capable of keeping a record of the documents created and modified by different users. It also allows for the assignment of roles to different users. This API also allows the end user to get the exact number of documents they require and set special queries for more precise matching.

This code base contains a REST API written in JavaScript, runs on Node v6.7.0 and utilizes ExpressJS for routing. This API has several endpoints that handle everything from user authentication to document management itself. This API makes use of JSON Web Tokens (JWT) to secure communications between the server and the client. This API makes use of PostgreSQL as the database and Sequelize as the Object Relational Mapper (ORM).

How to Use

To make use of this API, first create a clone by running the following command

git clone https://github.com/aezumezu/document-management-system.git

Next, you will need to create a .env file to store the environment variables in the root directory of the app. Your .env file must conform to the pattern shown below.

database = ***_the name of your database_***  
secret = ***_secret key to use in the app_***  
dbusername = ***_your database username_***   
dbpassword = ***_your database password_***   
PORT = ***_port to start the app. If ommited, default port 3000 will be used_***   


Run *_npm install_* to install app dependencies
Run *_npm start_* to seed the database and start the app

A tool such as Postman can be used to access the end points. JSON data may need to be sent to the server endpoints. The table below shows a comprehensive breakdown of the endpoints that this API exposes.


EndPoint  |  Functionality | Requires Authentication | Access Level
------------  |  ----------------- | -------------------------------- | ------------------
| POST /users/login	| Logs a user in.	| No | All |
| POST /users/ |	Creates a new user. |	No | All|
| GET /users/ |	Find matching instances of user. |	Yes | Admin
| GET /users/username |	Find user. |	Yes | Self
| PUT /users/username	| Update user attributes. |	Yes | Self & Admin
| DELETE /users/username |	Delete user. |	Yes | Self & Admin
| POST /documents/ |	Creates a new document instance. |	Yes | Admin & User
| GET /documents/	| Find matching instances of document. |	Yes | All
| GET /documents/?limit=x	| Find x matching instances of document. |	Yes | All
| GET /documents/?role=user |	Find instances of document with a user role. |	Yes | All
| GET /documents/?date=yyyy-MM-dd	| Find instances of document created on the given date.	| Yes | All
| GET /documents/?offset=y | Find instances of document starting at the yth index. |	Yes | All
| GET /documents/id	| Find document. |	Yes | All
| PUT /documents/id	| Update document attributes. |	Yes | Self & Admin
| DELETE /documents/id	| Delete document.	| Yes | Self & Admin
| GET /users/username/documents	| Find all documents belonging to the user.	| Yes | All
| POST /roles/ |	Creates a new role instance. | No | Admin
| GET /roles/	| Find matching instances of role. |	Yes | Admin
| GET /roles/title	| Find role.	| Yes | Admin
| PUT /roles/title |	Update role attributes.	| Yes | Admin
| DELETE /roles/title	| Delete role.	| Yes | Admin