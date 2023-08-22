<template>
  <iframe
      height="100%"
      width="100%"
      :src="url+ '/preview?token=' + Session.get('token') +'&name=' +name"
      frameborder="0"
      scrolling="no"
  />
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserInfosState } from "@/stores/userInfos";
import { Session } from '@/utils/storage';

const route = useRoute();
const url = ref(import.meta.env.VITE_REPORT_URL);
const name: any = ref('');
onMounted(() => {
  name.value = route.query.name;
});
</script>
