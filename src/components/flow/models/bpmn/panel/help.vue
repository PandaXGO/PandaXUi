<template>
    <div>
        <div class="help-title">{{content.title}}</div>
        <div class="help-sketch">{{content.sketch}}</div>
        <div class="help-description">{{content.description}}</div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    content: {
        type: Object,
    }
})
</script>

<style scoped>
.help-title {
    font-weight: 600;
    font-size: large;
}

.help-sketch {
    margin-top: 20px;
    font-style:oblique;
    font-size: 15px;
    color: #555;
}

.help-description {
    margin-top: 20px;
}


</style>
