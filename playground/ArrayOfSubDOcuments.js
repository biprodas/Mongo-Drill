const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/exercise', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Connection failed...'));

// Author Schema
const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

// Author Model
const Author = mongoose.model('author', authorSchema);


// Course Schema
const courseSchema = new mongoose.Schema({
  name: String,
  authors: [authorSchema]
});

// Course Model
const Course = mongoose.model('course', courseSchema);



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

async function createCourse(name, authors){
  const course = new Course({
    name,
    authors
  });
  const result = await course.save();
  console.log(result);
}

async function getCourses(){
  const courses = await Course.find();
  console.log(courses);
}

async function addAuthor(courseId, author){
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId){
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}


 createAuthor('Biprodas', 'Software Engineer', 'biprodas.me');
 createAuthor('Hiranmoy', 'Lab Technishian', 'hiranmoy.net');

createCourse('Mastering Node.js', [
  new Author({name: 'Biprodas'}),
  new Author({name: 'Hiranmoy'})
]);

// addAuthor('5c3ce486a4e04e17046a03cc', new Author({ name: 'Voza' }));

// removeAuthor('5c3ce486a4e04e17046a03cc', '5c3ce703058da801cc48250c');

getCourses();