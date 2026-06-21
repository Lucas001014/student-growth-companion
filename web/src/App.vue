<template>
  <div class="app-root">
    <template v-if="!auth.isLoggedIn">
      <router-view />
    </template>

    <template v-else-if="auth.role === 'admin'">
      <AdminLayout>
        <router-view />
      </AdminLayout>
    </template>

    <template v-else-if="auth.role === 'teacher'">
      <TeacherLayout>
        <router-view />
      </TeacherLayout>
    </template>

    <template v-else-if="auth.role === 'student'">
      <StudentLayout>
        <router-view />
      </StudentLayout>
    </template>

    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import AdminLayout from './layouts/AdminLayout.vue';
import TeacherLayout from './layouts/TeacherLayout.vue';
import StudentLayout from './layouts/StudentLayout.vue';

const auth = useAuthStore();
</script>

<style>
.app-root {
  min-height: 100vh;
  width: 100%;
  background: #f5f7fa;
}
</style>
