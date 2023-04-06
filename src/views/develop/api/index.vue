<template>
    <div class="importSwagger" style="width: 100%;margin: 10px auto;text-align: center;">
        <div id="swagger-ui" ></div>
    </div>
</template>
<script setup lang="ts">
import {onMounted} from "vue";
const baseURL = import.meta.env.VITE_API_URL

onMounted(() => {
   SwaggerUIBundle({
       url: baseURL + "/apidocs.json",
       dom_id: '#swagger-ui',
       deepLinking: true,
       presets: [
         SwaggerUIBundle.presets.apis,
         SwaggerUIStandalonePreset,
       ],
   })
});

</script>
<style></style>