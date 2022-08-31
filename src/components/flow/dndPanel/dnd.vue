<template>
    <div class="red-ui-palette-node" :style="{ backgroundColor: baseNode.background }">
        <div class="red-ui-palette-label">{{baseNode.text}}</div>
        <div class="red-ui-palette-icon-container">
            <div class="red-ui-palette-icon" :style="{ backgroundImage: `url(${baseNode.icon})`}"></div>
        </div>
        <div v-if="normal == 'left' || normal=='default'" class="red-ui-palette-port"></div>
        <div v-if="normal == 'right' || normal=='default'" class="red-ui-palette-port red-ui-palette-port-output"></div>
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