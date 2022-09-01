<template>
    <div class="palette-node" :style="{ backgroundColor: baseNode.background }">
        <div class="palette-label">{{baseNode.text}}</div>
        <div class="palette-icon-container">
            <div class="palette-icon" :style="{ backgroundImage: `url(${baseNode.icon})`}"></div>
        </div>
        <div v-if="normal == 'left' || normal=='default'" class="palette-port"></div>
        <div v-if="normal == 'right' || normal=='default'" class="palette-port palette-port-output"></div>
    </div>
</template>

<script lang="ts" setup>
    import "./dnd.css"
    const props = defineProps({
        normal: {
            type: String,
            default: "default",
        },
        baseNode: {
            type: Object,
        }
    })

</script>

<style scoped>

</style>
