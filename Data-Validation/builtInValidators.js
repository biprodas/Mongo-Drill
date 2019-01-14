const mongoose = require('mongoose');

// Connecting to MongoDB
mongoose.connect('mongodb://localhost/playground',  { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Connection failed...'));

// Defining a Schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    //match: /pattern/,
    minlength: 5,
    maxlength: 255
  },
  author: String,
  catagory: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network']
  },
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
    required: function() { return this.isPublished; },
    min: 10,
    max: 200
  }
});

// Creating a model
const Course = mongoose.model('Course', courseSchema);



// CRUD Operations

async function createCourse(){
  const course = new Course({
    name: 'Drill Node',
    author: 'Biprodas',
    catagory: '-',
    tags: ['react', 'frontend'],
    isPublished: true,
    price: 9
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