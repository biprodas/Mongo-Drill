
## Population
```
$ mongoimport --db mongo-exercises --collection courses --drop --file exercise-data.json --jsonArray
```

#### Connecting to MongoDB
```bash
const mongoose = require('mongoose');
# Connecting to MongoDB
mongoose.connect('mongodb://localhost/playground');
# Defining a Schema
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  data: Date,
  isPublished: Boolean,
  price: Number
});
# Creating a Model
const Course = mongoose.model('Course, courseSchema);
```

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

async function run(){
  const courses = await getCourses();
  console.log(courses);
}

run();
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

async function run(){
  const courses = await getCourses();
  console.log(courses);
}

run();
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

async function run(){
  const courses = await getCourses();
  console.log(courses);
}

run();
```