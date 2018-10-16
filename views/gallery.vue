<template>
  <div>
  <div class="cover text-center"  v-bind:style="{ backgroundImage: 'url(' + image1 + ')' }">
    <div>
          <h1 id="child">Gallery Object listing</span></h1>
    </div>
  </div>
    <div class="container custom-padding text-center">
        <table class="table table-border">
            <thead class="thead-dark">
                <th>Title</th>
                <th>Page url</th>
                <th>People</th>
                <th>Image</th>
            </thead>
            <tbody v-for="object in gallery_objects" >
                <tr>
                    <td><a v-bind:href="'/object/' + object.id">{{object.title}} </a></td>
                    <td>{{object.page_url }}</td>
                    <td>{{object.people}}</td>
                    <td><img v-bind:src="object.image" alt="No image"></td>
                </tr>
            </tbody>
        </table>
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