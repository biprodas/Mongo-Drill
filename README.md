# MongoDB CRUD Operations

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
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Connection failed...'));

# Defining a Schema
const courseSchema = new mongoose.Schema({
  name: String,
  author: ObjectID,
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

# CRUD Operations
## Saving a Document
```bash
# create a course
async function createCourse(){
  const course = new Course({
    name: 'Node.js Course',
    author: 'Biprodas',
    tags: ['node', 'express', 'mongoDB', 'Backend'],
    price: 11
  });
  # save the course in DB
  const result = await course.save();
  console.log('new course saved:\n', result);
}

createCourse();
```

--------------------------------------------------------------------

## Quering Documents

```bash
# Get at most 5 published Courses of author Biprodas
async function getCourses(){
  const courses = await Course
    .find({author: 'Biprodas', isPublished: true})
    .skip(2)
    .limit(5)
    .sort({date: -1})
    .select({ name: 1, author: 1 });

  console.log('GET Courses:\n', courses);
}

getCourses();
```

### Query Operators

See the [Document](https://docs.mongodb.com/manual/reference/operator/query/) here.

#### Comparison Query Operators
`eq`  
`ne`  
`gt`  
`gte`  
`lt`  
`lte`  
`in`  
`nin`  
`ne`

```bash
# get courses
const courses = await Course
  .find({price: {$gte: 10, $lt:20}});
```

#### Logical Query Operators
`and`  
`or`  
`not`  
`nor`  

```bash
# get courses
const courses = await Course
  .find()
  .or([ { author: 'Biprpodas' }, { isPublished: 'true'} ])
  .and([]);
```

#### Regular Expressions

```bash
const courses = await Course
  .find({ author: /pattern/ });

```
## Counting
```bash
# Get at most 5 published Courses of author Biprodas
async function getCourses(){
  const courses = await Course
    .find({author: 'Biprodas', isPublished: true})
    .limit(20)
    .sort({date: -1})
    .count();

  console.log('GET Courses:\n', courses);
}

getCourses();
```

## Pagination
```bash
# Route: url/api/courses/?pageNumber=2&pageSize=10
async function getCourses(){
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course
    .find({author: 'Biprodas', isPublished: true})
    .skip((pageNumber - 1)*pageSize)
    .limit(pageSize)
    .sort({date: -1})
    .select({ name: 1, author: 1 });

  console.log('GET Courses:\n', courses);
}

getCourses();
```
## Exercises:  
See [Quering Documents Exercise]()

### Exercise-01:  
Get all the published backend courses,  
sort them by their name,  
pick only their name and author,  
and display them. 

`solution-01.js`
```bash
# Solution-01
async function getCourses(){
  return await Course
    .find({ isPublished: true, tags: 'backend'})
    .sort({ name: 1})
    .select({ name: 1, author: 1});
}
```

### Exercise-02:  
Get all the published frontend and backend courses,  
sort them by their price in a descending order,  
pick only their name, author and price,  
and display them.  

`solution-02.js`
```bash
async function getCourses(){
  return await Course
    .find({ isPublished: true, tags: { $in: ['frontend', 'backend'] } })
    //.or([ {tags: 'frontend'}, {tags: 'backend'}])
    .sort('-price')
    .select('name author price');
}
```

### Exercise-03:  
Get all the published courses that are $15 or more,  
or have the word 'by' in their title. 

`solution-03.js`
```bash
async function getCourses(){
  return await Course
    .find({ isPublished: true })
    .or([ { price: {$gte: 15} }, name: /.*by.*/i ])
    .sort('-price')
    .select('name author price');
}
```

----------------------------------------------------------------------------------------------------



## Updating a Document

#### Approach: Query first

```bash
# findById
# Modify its properties
# save
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
```

#### Approach: update first
```bash
# Update directly
# Optionally get the updated document
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
```
See [MongoDB Update Operator](https://docs.mongodb.com/manual/reference/operator/update/)

#### Approach: update first and return it
```bash
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
```

--------------------------------------------------------------------------------
## Removing a document

```bash
async function removeCourse(id){
  //const result = await Course.deleteOne({ _id: id });
  //const result = await Course.deleteMany({ _id: id });
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}

removeCourse(course_id);
```

---------------------------------------------------------------------------------


# Author
[**Biprodas Roy**]()