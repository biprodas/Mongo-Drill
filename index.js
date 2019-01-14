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
    enum: ['web', 'mobile', 'network'],
    lowercase: true
  },
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function(v, callback){
        setTimeout(() => {
          //do some async work
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },
      message: 'A course should have at least one tag.'
    }
  },
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
    max: 200,
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
});

// Creating a model
const Course = mongoose.model('Course', courseSchema);



// CRUD Operations

async function createCourse(){
  const course = new Course({
    name: 'Drill Node',
    author: 'Biprodas',
    catagory: 'web',
    tags: ['nodejs', 'backend'],
    isPublished: true,
    price: 11
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