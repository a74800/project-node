<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import TasksView from './views/TasksView.vue'
import EventsView from './views/EventsView.vue'
import DashboardView from './views/DashboardView.vue'
import AuthView from './views/AuthView.vue'

const currentView = ref('tasks')
const user = ref(null)

onMounted(() => {
  const storedUser = localStorage.getItem('user')

  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }

  window.addEventListener('auth:logout', handleLogoutEvent)
})

onUnmounted(() => {
  window.removeEventListener('auth:logout', handleLogoutEvent)
})

function handleAuthenticated(authenticatedUser) {
  user.value = authenticatedUser
  currentView.value = 'tasks'
}

function handleLogoutEvent() {
  user.value = null
  currentView.value = 'tasks'
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  user.value = null
  currentView.value = 'tasks'
}
</script>

<template>
  <AuthView
    v-if="!user"
    @authenticated="handleAuthenticated"
  />

  <div v-else>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a class="navbar-brand" href="#">Task Manager</a>

      <div class="navbar-nav me-auto">
        <button class="btn btn-link nav-link" @click="currentView = 'tasks'">
          Tasks
        </button>

        <button class="btn btn-link nav-link" @click="currentView = 'events'">
          Histórico
        </button>

        <button class="btn btn-link nav-link" @click="currentView = 'dashboard'">
          Dashboard
        </button>
      </div>

      <div class="d-flex align-items-center gap-3">
        <span class="text-light">
          {{ user.name }}
        </span>

        <button class="btn btn-outline-light btn-sm" @click="logout">
          Logout
        </button>
      </div>
    </nav>

    <main class="container mt-4">
      <TasksView v-if="currentView === 'tasks'" />
      <EventsView v-if="currentView === 'events'" />
      <DashboardView v-if="currentView === 'dashboard'" />
    </main>
  </div>
</template>