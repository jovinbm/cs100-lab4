const express = require('express');
const expressVue = require('express-vue');
const path = require('path');
const Knex = require('knex');
require('cross-fetch/polyfill');

const hostname = '127.0.0.1';
const port = 3000;
const knex = Knex({
  client: 'sqlite3',
  connection: {
    filename: './database.db'
  },
  useNullAsDefault: false
})

// Initialize Express
const app = express();
app.use(express.static('static'));

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

const API_KEY = '81745fd0-b77e-11e8-a4d1-69890776a30b';

// stores object comments in sqlite database
function storeObjectComment(objectId, comment){
  return knex('comments')
    .insert({
      objectId,
      comment
    })
    .then(() => true)
}

// gets object comments from sqlite database
function getObjectComments(objectId){
  return knex('comments')
    .select(['comment'])
    .where('objectId', objectId)
    .map(c => c.comment)
}

// Options for express-vue
const vueOptions = {
  head: {
    title: 'Harvard Art Museums',
    metas: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
    ],
    styles: [
      {
        style: '/css/styles.css'
      },
      {
        style: 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
      }
    ]
  },
  rootPath: path.join(__dirname, '/views')
};


// Initialize express-vue
const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);

// List galleries
app.get('/',async (req, res) => {
  const url = `https://api.harvardartmuseums.org/gallery?size=100&apikey=${API_KEY}`;
  try {
    const response = await fetch(url);
    if(!response.ok){
      throw new Error(`Response from api not ok: ${response.status}`);
    }
    const dat = await response.json();
    let galleries = dat.records;
    const data= {
      galleries:galleries
    };
    res.renderVue('index.vue', data);
  }
  catch(error){
    console.error(error);
      res.json({
        error: error.message
      })
  }
});

// List objects
app.get('/gallery/:gallery_id', async (req, res) => {
  const url = `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&gallery=${req.params.gallery_id}`;
  try {
    const response = await fetch(url);
    if(!response.ok){
      throw new Error(`Response from api not ok: ${response.status}`);
    }
    const dat = await response.json();
    let gallery_json_objects = [];
    let images = [];
    let image1 = "";
    dat.records.forEach(object => {
      let image;
      if (object.primaryimageurl == null){
        image = "No image"
      }else{
        image  = `${object.primaryimageurl}?height=150&width=150`
        image1  = `${object.primaryimageurl}`
        images.push(image1);
      }
      people_arr = " ";
      if (object.people){
        object.people.forEach(person_info => {
          if(people_arr == " "){
            people_arr += person_info.name;
          }else{
            people_arr += ", " + person_info.name;
          }
        })
      }
      let object_info = {id: object.id, title: object.title, page_url: object.url, image:image, people:people_arr};
      gallery_json_objects.push(object_info);
    })
    const data= {
      gallery_objects:gallery_json_objects,
      images:images,
      image1: image1
    };

    res.renderVue('gallery.vue', data);
  }
  catch(error){
    console.error(error);
      res.json({
        error: error.message
      })
  }
});

const renderObjectPage = async (object_id, req, res) => {
  const url = `https://api.harvardartmuseums.org/object/${object_id}?apikey=${API_KEY}`;
  try {
    const response = await fetch(url);
    if(!response.ok){
      throw new Error(`Response from api not ok: ${response.status}`);
    }
    const data = await response.json();
    if (data.primaryimageurl == null){
      data.primaryimageurl = "No image"
    }else{
      data.primaryimageurl = `${data.primaryimageurl}`
    }
    const comments = await getObjectComments(object_id)
    res.renderVue('object.vue', {object: data, obj_comments : comments});
  }
  catch(error){
    console.error(error);
    res.json({
      error: error.message
    })
  }
}

app.get('/object/:object_id', async (req, res) => {
  return renderObjectPage(req.params.object_id, req, res);
});

// Comment on object
app.get('/objects/:object_id/comment', (req, res) => {
  return renderObjectPage(req.params.object_id, req, res);
});

app.post('/object/:object_id', async (req, res) => {
  try{
    let comment = req.body.comment;
    let objectId = req.params.object_id;
    await storeObjectComment(objectId, comment);
    return renderObjectPage(objectId, req, res);
  }catch(error){
    console.error(error);
    res.json({
      error: error.message
    })
  }
});

// Listen on socket
app.listen(port, hostname, () => {
  console.log(`Server running on http://${hostname}:${port}/`);
});
