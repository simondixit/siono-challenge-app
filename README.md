# SIONO-CHALLENGE-APP

# Summary
This app made by myself responds to the request of a certain company to solve the following problem:

"A fictional client has requested a Node.js server with an API that can compute the top N most frequent (not case sensitive) words in a text file. The API must meet the following specifications".

Inputs: The API must be able to accept a (potentially large) text file and an arbitrary integer N. The inputs will have the following constraints:
* file content will be at maximum 1gb of text content - we will be testing your solution with large files up to this limit
* file content will always be utf8
* n can be any positive integer in the following range: [1, K] where K is the number of unique words in the text file

Outputs: The API is expected to return the top N most frequent words in the text file as JSON.

For the development of this application I used Vite, React, Typescript, Nodejs, Express and other third-party libraries.

# How to Install and Run the App

REQUIREMENTS:

```
Node.js: v16.14.0;
Yarn: v1.22.10;
```

In the root folder run the following commands to install dependencies and build up user interface

```
yarn && yarn build
```

Run the app using the following command:

```
yarn start
```

Use the following command to run tests:

```
yarn test
```

# How to Use the Project

You can use a HTTP client to test the API.

As seen in the image below, there is only one API call of type POST that receives a parameter of type number and a file sent as multipart/data-form

![swagger](https://user-images.githubusercontent.com/87045338/158280057-98816c84-8500-4542-becc-3e5a351b76f8.jpg)

#OR

You can open up your browser and go to localhost:3000 where the app will deliver you an interface the I set up for you :smiley:

![interface](https://user-images.githubusercontent.com/87045338/158281464-61450444-5b01-4c77-b3ec-d8ee326e82ec.jpg)

# How to use the cool interface?

- Click on Choose File button to select the file.
- Insert a number inside the input beside the Submit button.
- Click on Submit button to send the request to the API.
- Wait to see the result in the area below.
