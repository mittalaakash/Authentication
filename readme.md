In order to get started with this API, you've to create a config.env file in the root directory and then specify there variables

DATABASE=mongodb://localhost:27017/appen (MongoDB database String)
JWT_SECRET= this-is-a-secret-string (String)
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

create user with POST on /api/users/signup
{
"name": "test",
"email":"test@mail.com",
"password":"test1234",
"passwordConfirm": "test1234"  
}

login user with POST on /api/users/login
{
"email":"test@mail.com",
"password":"test1234"

}

\*\*for requests mentioned below you've to login first

\*\*Password update is implemented with different route due to hashin in pre save hook

update password with PATCH on /api/users/updatePassword
{
"passwordCurrent": "test1234",
"password":"test4321",
"passwordConfirm": "test4321"
}

update password with PATCH on api/users/updateData
{
"email":"admin@mail.com",
"name":"admin",
}

find user with GET on api/users/:id

delete user with DELETE on api/users/:id

logout user with GET on api/users/logout
