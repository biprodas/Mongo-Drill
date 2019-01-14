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
  author: {
    type: authorSchema,
    required: true
  }
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

async function createCourse(name, author){
  const course = new Course({
    name,
    author
  });
  const result = await course.save();
  console.log(result);
}

async function getCourses(){
  const courses = await Course.find();
  console.log(courses);
}

/*
async function updateCourseAuthor(courseId){
  const course = await Course.findById(courseId);
  course.author.name = 'Bipro';
  course.save();
}
*/
async function updateCourseAuthor(courseId){
  const course = await Course.update({_id: courseId}, {
    $set: {
      'author.name': 'Biprodas Roy'
    }
  });
}



 // createAuthor('Biprodas', 'Software Engineer', 'biprodas.me');
 // createAuthor('Hiranmoy', 'Lab Technishian', 'hiranmoy.net');

 // createCourse('Mastering Node.js', new Author({name: 'Biprodas'}));

// updateCourseAuthor('5c3ccdc70c190a13e05ce34b');

getCourses();