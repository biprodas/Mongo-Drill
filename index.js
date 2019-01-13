const mongoose  = require('mongoose');


// Connecting to MongoDB
mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Connection Failed!', err));

// Defining a Schema
const courseSchema = new mongoose.Schema({
  name: String,
  author: String, //ObjectID
  tags: [String],
  date: {
    type: Date,
    default: Date.now
  },
  price: Number,
  isPublished: {
    type: Boolean,
    default: false
  }
});

// Creating a model
const Course = mongoose.model('Course', courseSchema);

/*
// Saving a document
async function createCourse(){
  const course = new Course({
    name: 'Node.js Course',
    author: 'Biprodas',
    tags: ['node', 'express', 'mongoDB', 'Backend'],
    price: 11
  });

  const result = await course.save();
  console.log('new course saved:\n', result);
}

createCourse();

//console.log('Hello..');
*/

// Quering Documents
async function getCourses(){
  const courses = await Course
    .find({author: 'Biprodas', isPublished: true})
    .skip()
    .limit(5)
    .sort({date: -1})
    .select({ name: 1, date: 1 });

  console.log('GET Courses:\n', courses);
}

getCourses();