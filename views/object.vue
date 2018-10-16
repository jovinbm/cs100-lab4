<template>
  <div>
  <div class="cover text-center"  v-bind:style="{ backgroundImage: 'url(' + object.primaryimageurl + ')' }">
    <div>
          <h1 id="child">{{object.title}}</span></h1>
    </div>
  </div>
    <div class="container custom-padding text-center">
            <div class="container">
            <h3>{{object.title}}</h3>
                <b>Description:</b>{{object.description}}<br> 
                <b>Provenance:</b>{{object.provenance}}<br> 
                <b>Accession Year:</b>{{object.accessionyear}}<br>
                </ul>
            </div>

            <div class="container">
            <h1>Comments</h1>
            <form v-bind:action="'/object/' + object.id" method="post">
                <textarea 
                    autocomplete="off" 
                    autofocus 
                    name="comment"
                    id="comment"
                    placeholder="add comment" 
                    rows="5"
                    style="width: 100%"
                    type="text">
                </textarea>
                <button type="submit" class="btn-primary">Post</button>
            </form>
            <br>

            
            <ul v-for="comments in obj_comments">
                <li>{{comments}}</li>
            </ul>
            </div>
    </div>
  </div>  
</template>

<script>
  export default{
    data: function(){
      return{}
  }
  }
</script>

<style>
</style>
