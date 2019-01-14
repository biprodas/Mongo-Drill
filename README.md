# MongoDB - Data Validation

#### Prerequisites
  - Install [Node.js]()
  - Install and Connect [MongoDB]() 
  - [MongoDB Compass]() or [Robo 3T]() (Optional)

## Quick Start
```bash
# Installation
$ npm install mongoose -save

# Importing
const mongoose = require('mongoose');

# Connecting to MongoDB
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Connection failed...'));

# Defining a Schema
const courseSchema = new mongoose.Schema({
  name: String,
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
  price: Number
});

# Creating a model
const Course = mongoose.model('Course', courseSchema);

```

## CRUD Operations
```bash
# Saving a Document
async function createCourse(){
  const course = new Course({
    name: 'Node.js Course',
    author: 'Biprodas',
    tags: ['node', 'express', 'mongoDB', 'Backend'],
    price: 11
  });
  const result = await course.save();
  console.log(result);
}

createCourse();


# Quering Documents
async function getCourses(){
  const courses = await Course
    .find({author: 'Biprodas', isPublished: true})
    .skip(2)
    .limit(5)
    .sort({date: -1})
    .select({ name: 1, author: 1 });
  console.log(courses);
}

getCourses();


# Updating a Document (Query first)
async function updateCoure(id){
  const course = await Course.findById(id);
  if (!course) return;

  course.set({ 
    name: 'Mastering Node.js',
    author: 'Mosh',
    isPublished: true
  });

  const result = await course.save();
  console.log(result);
}

updateCourse(course_id);


# Updating a Document (Update first)
async function updateCoure(id){
  const result = await Course.update({ _id: id }, {
    $set: { 
      name: 'Mastering Node.js',
      author: 'Mosh',
      isPublished: true
    }
  });
  console.log(result);
}

updateCourse(course_id);


# Updating a Document: (update first and return it)
async function updateCoure(id){
  const course = await Course.findByIdAndUpdate(id, {
    $set: { 
      name: 'Mastering Node.js',
      author: 'Mosh Hamedani',
      isPublished: true
    }
  }, { new: true });
  console.log(result);
}

updateCourse(course_id);


# Removing a document
async function removeCourse(id){
  //const result = await Course.deleteOne({ _id: id });
  //const result = await Course.deleteMany({ _id: id });
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}

removeCourse(course_id);
```
-----------------------------------------------------------------------------


# Data Validation
When defining a schema, you can set the type of a property to a SchemaType object. You use this object to define the validation requirements for the given property.

## Adding Validation
```bash
#  Schema
new mongoose.Schema({
    name: { 
      type: String, 
      required: true 
    }
    author: String,
    date: {type: Date, default: Date.now}
})

# CRUD Operations
# Saving a Document
async function createCourse(){
  const course = new Course({
    //name: 'Mastering Node.js', 
    # error.message - "Course validation failed: name: Path `name` is required."
    author: 'Mosh'
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
```

Validation logic is executed by Mongoose prior to saving a document to the database. You can also trigger it manually by calling the validate() method.

```bash
course.validate(err => {
  if(err){ console.log(err.message)};
});
# or,
const isValid = await course.validate();
if(!isValid){ ... };
```



## Built-in Validators
  - Strings: `minlength`, `maxlength`, `match`, `enum`
  - Numbers: `min`, `max`
  - Dates: `min`, `max`
  - All types: `required`

```bash
# Schema
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

# CRUD Operations
# Saving a Document
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
```



## Custom Validators

```bash
tags: {
  type: Array,
  validate: {
    validator: function(v) { return v && v.length > 0; },
    message: 'A course should have at least 1 tag.'
  }
}
```


## Async Validators
- If you need to talk to a database or a remote service to perform the validation, you need to create an async validator.

```bash
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
}
```

#### Check Validation Errors
```bash
  try{
    const result = await course.save();
    console.log(result);
  }
  catch(err){
    for(field in err.errors){
      console.log(err.errors[field]).message;
    }
  }
```

Other useful SchemaType properties:
  - Strings: `lowercase`, `uppercase`, `trim`
  - All types: `get`, `set` (to define a custom getter/setter)

```bash
price: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v)
}
```


# Author
[**Biprodas Roy**]()