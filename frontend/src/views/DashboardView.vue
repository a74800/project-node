<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/api'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
)

const taskStatusMetrics = ref([])
const eventTypeMetrics = ref([])
const loading = ref(false)
const error = ref('')

const taskStatusChartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Tasks',
      data: []
    }
  ]
})

const eventTypeChartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Eventos',
      data: []
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

async function loadMetrics() {
  try {
    loading.value = true
    error.value = ''

    const taskResponse = await api.get('/metrics/tasks/status')
    const eventResponse = await api.get('/metrics/events/types')

    taskStatusMetrics.value = taskResponse.data
    eventTypeMetrics.value = eventResponse.data

   taskStatusChartData.value = {
  labels: taskStatusMetrics.value.map(item => item.status),
  datasets: [
    {
      label: 'Tasks por estado',
      data: taskStatusMetrics.value.map(item => item.total),
      backgroundColor: [
        '#ffc107',
        '#0d6efd',
        '#198754'
      ],
      borderColor: '#ffffff',
      borderWidth: 2
    }
  ]
}

    eventTypeChartData.value = {
  labels: eventTypeMetrics.value.map(item => item.event_type),
  datasets: [
    {
      label: 'Eventos por tipo',
      data: eventTypeMetrics.value.map(item => item.total),
      backgroundColor: [
        '#0d6efd',
        '#ffc107',
        '#dc3545'
      ],
      borderWidth: 1
    }
  ]
}
  } catch (err) {
    error.value = 'Erro ao carregar métricas'
  } finally {
    loading.value = false
  }
}

onMounted(loadMetrics)
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Dashboard</h2>
      <button class="btn btn-outline-primary" @click="loadMetrics">
        Atualizar
      </button>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-if="loading" class="alert alert-info">
      A carregar métricas...
    </div>

    <div v-else class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Tasks por estado</h5>

            <div style="height: 300px;">
              <Doughnut
                :data="taskStatusChartData"
                :options="chartOptions"
              />
            </div>

            <ul class="list-group mt-3">
              <li
                v-for="item in taskStatusMetrics"
                :key="item.status"
                class="list-group-item d-flex justify-content-between"
              >
                <span>{{ item.status }}</span>
                <strong>{{ item.total }}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Eventos por tipo</h5>

            <div style="height: 300px;">
              <Bar
                :data="eventTypeChartData"
                :options="chartOptions"
              />
            </div>

            <ul class="list-group mt-3">
              <li
                v-for="item in eventTypeMetrics"
                :key="item.event_type"
                class="list-group-item d-flex justify-content-between"
              >
                <span>{{ item.event_type }}</span>
                <strong>{{ item.total }}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>