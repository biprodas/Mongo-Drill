const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/exercise', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Connection failed...'));


// Author Schema & Model
const Author = mongoose.model('author', new mongoose.Schema({
  name: String,
  bio: String,
  website: String
}));

// Course Schema & Model
const Course = mongoose.model('course', new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
}));



// CRUD Operations

async function createAuthor(name, bio, website){
  const author = new Author({
    name,
    bio, 
    website
  });
  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author){
  const course = new Course({
    name,
    author
  });
  const result = await course.save();
  console.log(result);
}

async function getCourses(){
  const courses = await Course
    .find()
    .select('name');
  console.log(courses);
}


// createAuthor('Biprodas', 'Software Engineer', 'biprodas.me');
// createAuthor('Hiranmoy', 'Lab Technishian', 'hiranmoy.net');

// createCourse('Mastering React', '5c3cc09c73c1d71aac248147')

getCourses();