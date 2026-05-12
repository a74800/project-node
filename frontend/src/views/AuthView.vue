<script setup>
import { ref } from 'vue'
import api from '../api/api'

const mode = ref('login')

const name = ref('')
const email = ref('')
const password = ref('')

const error = ref('')
const loading = ref(false)

const emit = defineEmits(['authenticated'])

async function submit() {
  try {
    loading.value = true
    error.value = ''

    const endpoint = mode.value === 'login'
      ? '/auth/login'
      : '/auth/register'

    const payload = mode.value === 'login'
      ? {
          email: email.value,
          password: password.value,
        }
      : {
          name: name.value,
          email: email.value,
          password: password.value,
        }

    const response = await api.post(endpoint, payload)

    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    emit('authenticated', response.data.user)
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro de autenticação'
  } finally {
    loading.value = false
  }
}

function toggleMode() {
  error.value = ''
  mode.value = mode.value === 'login' ? 'register' : 'login'
}
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow" style="width: 420px;">
      <div class="card-body">
        <h3 class="card-title mb-4 text-center">
          {{ mode === 'login' ? 'Login' : 'Criar conta' }}
        </h3>

        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div v-if="mode === 'register'" class="mb-3">
          <label class="form-label">Nome</label>
          <input v-model="name" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" />
        </div>

        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="submit"
        >
          {{ loading ? 'A processar...' : mode === 'login' ? 'Entrar' : 'Registar' }}
        </button>

        <button class="btn btn-link w-100 mt-3" @click="toggleMode">
          {{ mode === 'login' ? 'Ainda não tenho conta' : 'Já tenho conta' }}
        </button>
      </div>
    </div>
  </div>
</template>