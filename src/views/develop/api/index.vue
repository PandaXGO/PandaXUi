<template>
    <div class="importSwagger" style="width: 100%;margin: 10px auto;text-align: center;">
        <div id="swagger-ui" ></div>
    </div>
</template>
<script setup lang="ts">
import { SwaggerUIBundle,SwaggerUIStandalonePreset } from 'swagger-ui-dist'
import {onMounted} from "vue";
const baseURL = import.meta.env.VITE_API_URL

onMounted(() => {
    const ui = SwaggerUIBundle({
        url: baseURL + "/apidocs.json",
        dom_id: '#swagger-ui',
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
    })
});

</script>
<style src="swagger-ui-dist/swagger-ui.css"></style>