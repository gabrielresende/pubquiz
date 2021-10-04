# PubQuiz
Create and host online quizzes.

![Demo Animation](../assets/demo.gif?raw=true)

## About
PubQuiz is a web application developed using Ruby on Rails and React. It was a playground project to learn more about ActiveCable and websockets in Rails/React and have fun with my family and friends.

### Creating a quiz
1. Create a new quiz
2. Add questions
3. Share link with participants

### Hosting a quiz
1. Wait participants to join
2. Send questions
3. Assign points and save round

## Getting started
### Prerequisites
- Ruby 2.6.0
- Bundler (`gem install bundler`)
- libpq-dev (`sudo apt install libpq-dev`)
- Node >= 8.16.0 (`sudo apt install nodejs`)
- Yarn (`sudo apt-get install yarn`)
- PostgreSQL

### Setup
1. Clone the repository
2. Install the dependencies
```
$ bundle install
$ yarn install
```
3. Create the database with a superuser role (required for pgcrypto extension) and run the migrations
```
$ rails db:create
$ rails db:migrate
```
4. Run the server
```
$ rails s
```

Open it in http://localhost:3000

### Running tests
Oops... Sorry about that!
