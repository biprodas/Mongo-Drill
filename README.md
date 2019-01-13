# Course Management
> RESTful APIs & CRUD Operations demo with Node, Express, MongoDB, Mongoose


# Mongo DB

- MongoDB is an open-source document database. It stores data in flexible, JSONlike documents.  
- In relational databases we have tables and rows, in MongoDB we have collections and documents. A document can contain sub-documents.  
- We don’t have relationships between documents.  


## Prerequisites
  - Install [Node.js]()
  - Install and Connect [MongoDB]() 
  - [MongoDB Compass]() or [Robo 3T]() (Optional)

## Installation
```bash
$ npm install mongoose -save
```

## Importing
```bash
# Using Node.js `require()`
const mongoose = require('mongoose');

# Using ES6 imports
import mongoose from 'mongoose';
```

## Mongo DB Connection
```bash
# Connecting to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Connection failed...'));
```

## Schema
To store objects in MongoDB, we need to define a Mongoose schema first. The schema defines the shape of documents in MongoDB.

```bash
# Defining a Schema
const courseSchema = new mongoose.Schema({
    name: String,
    price: Number
});
```
We can use a SchemaType object to provide additional details.  
Supported types are: **`String`, `Number`, `Date`, `Buffer` , `Boolean`, `ObjectID`, `Array`.**

```bash
# Using a SchemaType object
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
```

## Model
Once we have a schema, we need to compile it into a model. A model is like a class. It’s a blueprint for creating objects.

```bash
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



# Mongoose: Data Validation
When defining a schema, you can set the type of a property to a SchemaType object. You use this object to define the validation requirements for the given property.

```bash
# Adding validation
new mongoose.Schema({
    name: { 
      type: String, 
      required: true 
    }
})
```

- Validation logic is executed by Mongoose prior to saving a document to the database. You can also trigger it manually by calling the validate() method.
- Built-in validators:
  - Strings: minlength, maxlength, match, enum
  - Numbers: min, max
  - Dates: min, max
  - All types: required

```bash
# Custom validation
tags: [
    type: Array,
    validate: {
        validator: function(v) { return v && v.length > 0; },
        message: 'A course should have at least 1 tag.'
    }
]
```

- If you need to talk to a database or a remote service to perform the validation, you need to create an async validator:

```bash
validate: {
    isAsync: true
    validator: function(v, callback) {
        # Do the validation, when the result is ready, call the callback
        callback(isValid);
    }
}
```

- Other useful SchemaType properties:
  - Strings: lowercase, uppercase, trim
  - All types: get, set (to define a custom getter/setter)

```bash
price: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v)
}
```


#### Mongoose: Modelling Relationships between Connected Data

- To model relationships between connected data, we can either reference a document or embed it in another document.
- When referencing a document, there is really no relationship between these two documents. So, it is possible to reference a non-existing document.
- Referencing documents (normalization) is a good approach when you want to enforce data consistency. Because there will be a single instance of an object in the database. But this approach has a negative impact on the performance of your queries because in MongoDB we cannot JOIN documents as we do in relational databases. So, to get a complete representation of a document with its related documents, we need to send multiple queries to the database.
- Embedding documents (denormalization) solves this issue. We can read a complete representation of a document with a single query. All the necessary data is embedded in one document and its children. But this also means we’ll have multiple copies of data in different places. While storage is not an issue these days, having multiple copies means changes made to the original document may not propagate to all copies. If the database server dies during an update, some documents will be inconsistent. For every business, for every
problem, you need to ask this question: “can we tolerate data being inconsistent for a short period of time?” If not, you’ll have to use references. But again, this means that your queries will be slower.

```bash
# Referencing a document
const courseSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ‘Author’
    }
})

# Referencing a document
const courseSchema = new mongoose.Schema({
    author: {
        type: new mongoose.Schema({
            name: String,
            bio: String
        })
    }
})
```

- Embedded documents don’t have a save method. They can only be saved in the context of their parent.

```bash
# Updating an embedded document
const course = await Course.findById(courseId);
course.author.name = 'New Name';
course.save();
```

- We don’t have transactions in MongoDB. To implement transactions, we use a pattern called "Two Phase Commit". If you don’t want to manually implement this pattern, use the Fawn NPM package:

```bash
# Implementing transactions using Fawn
try {
  await new Fawn.Task()
    .save('rentals', newRental)
    .update('movies', { _id: movie._id }, { $`inc`: numberInStock: -1 })
    .run();
  }
catch(ex) {
  # At this point, all operations are automatically rolled back
}
```

- ObjectIDs are generated by MongoDB driver and are used to uniquely identify a document. They consist of 12 bytes:
- 4 bytes: timestamp
- 3 bytes: machine identifier
- 2 bytes: process identifier
- 3 byes: counter
- ObjectIDs are almost unique. In theory, there is a chance for two ObjectIDs to be
equal but the odds are very low (1/16,000,000) for most real-world applications.
```bash
# Validating ObjectIDs
mongoose.Types.ObjectID.isValid(id);
```
- To validate ObjectIDs using joi, use joi-objectid NPM package.