<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/api'

const events = ref([])

async function loadEvents() {
  const response = await api.get('/events')
  events.value = response.data
}

onMounted(loadEvents)
</script>

<template>
  <div>
    <h2 class="mb-4">Histórico de eventos</h2>

    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Task ID</th>
          <th>Evento</th>
          <th>Data</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="event in events" :key="event.id">
          <td>{{ event.id }}</td>
          <td>{{ event.task_id }}</td>
          <td>{{ event.event_type }}</td>
          <td>{{ new Date(event.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>