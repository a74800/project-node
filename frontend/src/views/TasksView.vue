<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/api'

const tasks = ref([])
const title = ref('')
const description = ref('')
const status = ref('pending')
const loading = ref(false)

async function loadTasks() {
  const response = await api.get('/tasks')
  tasks.value = response.data
}

async function createTask() {
  if (!title.value.trim()) return

  await api.post('/tasks', {
    title: title.value,
    description: description.value,
    status: status.value,
  })

  title.value = ''
  description.value = ''
  status.value = 'pending'

  await loadTasks()
}

async function updateStatus(task, newStatus) {
  await api.put(`/tasks/${task.id}`, {
    title: task.title,
    description: task.description,
    status: newStatus,
  })

  await loadTasks()
}

async function deleteTask(id) {
  await api.delete(`/tasks/${id}`)
  await loadTasks()
}

onMounted(async () => {
  loading.value = true
  await loadTasks()
  loading.value = false
})
</script>

<template>
  <div>
    <h2 class="mb-4">Tasks</h2>

    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Criar task</h5>

        <div class="mb-3">
          <label class="form-label">Título</label>
          <input v-model="title" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">Descrição</label>
          <textarea v-model="description" class="form-control"></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Estado</label>
          <select v-model="status" class="form-select">
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <button class="btn btn-primary" @click="createTask">
          Criar
        </button>
      </div>
    </div>

    <div v-if="loading">A carregar...</div>

    <table v-else class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Descrição</th>
          <th>Estado</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.title }}</td>
          <td>{{ task.description }}</td>
          <td>
            <span class="badge bg-secondary">
              {{ task.status }}
            </span>
          </td>
          <td class="d-flex gap-2">
            <button class="btn btn-sm btn-warning" @click="updateStatus(task, 'in_progress')">
              In progress
            </button>
            <button class="btn btn-sm btn-success" @click="updateStatus(task, 'done')">
              Done
            </button>
            <button class="btn btn-sm btn-danger" @click="deleteTask(task.id)">
              Apagar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>