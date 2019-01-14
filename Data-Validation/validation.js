const mongoose = require('mongoose');

// Connecting to MongoDB
mongoose.connect('mongodb://localhost/playground',  { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Connection failed...'));

// Defining a Schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  author: String,
  tags: [String],
  date: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: function() { return this.isPublished; }
  }
});

// Creating a model
const Course = mongoose.model('Course', courseSchema);


// CRUD Operations

async function createCourse(){
  const course = new Course({
    //name: 'Mastering Node.js',
    author: 'Mosh',
    tags: ['react', 'frontend'],
    isPublished: true,
    //price: 11
  });
  try{
    const result = await course.save();
    console.log(result);
  }
  catch(err){
    console.log(err.message);
  }
}

createCourse();