<template>
 <iframe
      height="100%"
      width="100%"
      :src="url+ '/?token=' + Session.get('token') +'&screenId=' +screenId +'&userId=' +userId"
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
const userInfos = useUserInfosState();
const userId = computed(() => userInfos.userInfos.userId);
const url = ref(import.meta.env.VITE_SCREEN_URL);
const screenId: any = ref('');
onMounted(() => {
  screenId.value = route.query.id;
});
</script>