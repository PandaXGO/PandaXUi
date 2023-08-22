<template>
  <iframe
      height="100%"
      width="100%"
      :src="url+ '/#/view?token=' + Session.get('token') +'&ruleId=' +ruleId"
      frameborder="0"
      scrolling="no"
  />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Session } from '@/utils/storage';

const route = useRoute();
const url = ref(import.meta.env.VITE_RULE_URL);
const ruleId: any = ref('');
onMounted(() => {
  ruleId.value = route.query.id;
});
</script>
