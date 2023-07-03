# CRUD-API
Project is written using Typescript

#### Task:
[Assignment: CRUD API](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

####  Download Task:

    git clone (by HTTPS) https://github.com/margarita-sh/CRUD-API.git
	git clone (by SSH) git@github.com:margarita-sh/CRUD-API.git

#### install dependecies:

    npm i

#### Go to crud-api branch

    git checkout crud-api


#### Run application in development mode

    npm run start:dev

#### Download Postman

	https://www.postman.com/downloads/

#### Exampla usage:

 1) when you first time run the project, don't forget launch app (npm run start:dev), put in postman http://localhost:3000/api/users/, send GET-request, example of response: 

		{ "message": []};

2) send POST request, insert your body in "row" tab
 example of body: {
    "username": "Sam",
    "age": 20,
    "hobbies": ["sport", "art"]
};

example of response: {
    "message": {
        "username": "Sam",
        "age": 20,
        "hobbies": [
            "sport",
            "art"
        ],
        "id": "dc3fff10-1925-11ee-b3da-5746b6712337"
    }
}

3) you can get this user by id, put in postman http://localhost:3000/api/users/dc3fff10-1925-11ee-b3da-5746b6712337, send GET-request, example of response: 

{
    "message": {
        "username": "Sam",
        "age": 20,
        "hobbies": [
            "sport",
            "art"
        ],
        "id": "dc3fff10-1925-11ee-b3da-5746b6712337"
    }
}

4) you can update some information, using PUT method, put in postman http://localhost:3000/api/users/dc3fff10-1925-11ee-b3da-5746b6712337, send PUT-request, don't forget about body!

 example of body: {
    "username": "Max",
    "age": 30,
    "hobbies": ["sport", "art"]
};

example of response: {
 {
    "message": {
        "username": "Max",
        "age": 30,
        "hobbies": [
            "sport",
            "art"
        ],
        "id": "dc3fff10-1925-11ee-b3da-5746b6712337"
    }
}
}

5) then you can remove this user, using DELETE method, put in postman http://localhost:3000/api/users/dc3fff10-1925-11ee-b3da-5746b6712337, send DELETE-request and you get 204 code.

6) Now You can try to get this user using GET-method, put you previos id into url http://localhost:3000/api/users/dc3fff10-1925-11ee-b3da-5746b6712337, 
example of response: {
    "message": "User is not found"
}
and 404 status

##### Run test scenarios for application

    npm run test

