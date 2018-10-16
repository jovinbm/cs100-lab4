<template>
  <div>
    <div class="cover text-center" id="parent">
      <div>
          <h1 id="child">A Tour of the Harvard Art Museum</span></h1>
      </div>
    </div>
    <div class="container custom-padding">
      <h1>Gallery Listing</h1>
      <ul>
        <li v-for="gallery in galleries">
          <a v-bind:href="'/gallery/' + gallery.id ">Gallery # {{gallery.id}}: {{gallery.name}}  (Floor {{gallery.floor}})</a>
        </li>
      </ul>
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
