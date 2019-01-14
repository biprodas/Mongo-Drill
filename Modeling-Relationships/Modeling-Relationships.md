# MongoDB - Modeling Relatioships Between Connected Data

## Quick Start

#### Prerequisites
  - Install [Node.js]()
  - Install and Connect [MongoDB]() 
  - [MongoDB Compass]() or [Robo 3T]() (Optional)

#### Schema, Model and MongoDB Connection
```bash
# Installation
$ npm install mongoose -save

# Importing
const mongoose = require('mongoose');

# Connecting to MongoDB
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Connection failed...'));

# Defining a Schema with Data Validation
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


# Creating a Model
const Course = mongoose.model('Course', courseSchema);

```


#### CRUD Operations
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

----------------------------------------------------------------------------------

# MongoDB: Modelling Relationships between Connected Data

- To model relationships between connected data, we can either reference a document or embed it in another document.
- When **referencing a document**, there is really no relationship between these two documents. So, it is possible to reference a non-existing document.
- **Referencing documents (normalization)** is a good approach when you want to enforce data consistency. Because there will be a single instance of an object in the database. But this approach has a negative impact on the performance of your queries because in MongoDB we cannot JOIN documents as we do in relational databases. So, to get a complete representation of a document with its related documents, we need to send multiple queries to the database.
- **Embedding documents (denormalization)** solves this issue. We can read a complete representation of a document with a single query. All the necessary data is embedded in one document and its children. But this also means we’ll have multiple copies of data in different places. While storage is not an issue these days, having multiple copies means changes made to the original document may not propagate to all copies. If the database server dies during an update, some documents will be inconsistent. For every business, for every
problem, you need to ask this question: “can we tolerate data being inconsistent for a short period of time?” If not, you’ll have to use references. But again, this means that your queries will be slower.


### **Referencing documents** vs **Embedding documents**

```bash
let author = {
  name = "Biprodas"
  // other properties
}

# Reference a document (normalization) -> CONSISTENCY
let course = {
  author: 'id'
}

# Embed a document (denormalization) -> PERFORMANCE
let course = {
  author: {
    name: "Biprodas"
  }
}

# Hybrid
let course = {
  author: {
    id: 'ref',
    name: "Biprodas"
  }
}
```

## Referencing documents (normalization)
```bash
# Author Schema & Model
const Author = mongoose.model('author', new mongoose.Schema({
  name: String,
  bio: String,
  website: String
}));

# Course Schema & Model
const Course = mongoose.model('course', new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId, # Referencing Author
    ref: 'Author'
  }
}));
```

## Embedding documents (denormalization)
```bash
# Author Schema
const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

# Author Model
const Author = mongoose.model('author', authorSchema);


# Course Schema
const courseSchema = new mongoose.Schema({
  name: String,
  author: {
    type: authorSchema, # Embedding Author
    required: true
  }
});

# Course Model
const Course = mongoose.model('course', courseSchema);
```

Embedded documents don’t have a save method. They can only be saved in the context of their parent.
```bash
# Updating an embedded document
async function updateCourseAuthor(courseId){
  const course = await Course.findById(courseId);
  course.author.name = 'Biprodas';
  course.save();
}
# or update directly
async function updateCourseAuthor(courseId){
  const course = await Course.update({_id: courseId}, {
    $set: {
      'author.name': 'Biprodas Roy'
    }
  });
}
```


We don’t have transactions in MongoDB. To implement transactions, we use a pattern called "Two Phase Commit". If you don’t want to manually implement this pattern, use the Fawn NPM package:
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

ObjectIDs are generated by MongoDB driver and are used to uniquely identify a document. They consist of 12 bytes:
- 4 bytes: timestamp
- 3 bytes: machine identifier
- 2 bytes: process identifier
- 3 byes: counter

ObjectIDs are almost unique. In theory, there is a chance for two ObjectIDs to be equal but the odds are very low (1/16,000,000) for most real-world applications.
```bash
# Validating ObjectIDs
mongoose.Types.ObjectID.isValid(id);
```


To validate ObjectIDs using joi, use joi-objectid NPM package.