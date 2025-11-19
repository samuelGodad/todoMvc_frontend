import { defineStore, acceptHMRUpdate } from 'pinia'
import { Notify } from 'quasar'
import axios from 'config/axios'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    filter: 'all', // 'all', 'active', 'completed'
    loading: false,
  }),

  getters: {
    activeTasks: (state) => state.tasks.filter(task => !task.completed),
    completedTasks: (state) => state.tasks.filter(task => task.completed),
    filteredTasks: (state) => {
      if (state.filter === 'active') {
        return state.tasks.filter(task => !task.completed)
      } else if (state.filter === 'completed') {
        return state.tasks.filter(task => task.completed)
      }
      return state.tasks
    },
    tasksCount: (state) => state.tasks.length,
    activeTasksCount: (state) => state.tasks.filter(task => !task.completed).length,
    completedTasksCount: (state) => state.tasks.filter(task => task.completed).length,
  },

  actions: {
    /**
     * Fetch tasks from API
     */
    async fetchTasks(filter = 'all') {
      this.loading = true
      this.filter = filter
      try {
        const response = await axios.get(`/tasks?filter=${filter}`)
        if (response.data?.success) {
          this.tasks = response.data.tasks || []
          return true
        } else {
          this.showErrorNotification(response.data?.message || 'Failed to fetch tasks')
          return false
        }
      } catch (error) {
        this.showErrorNotification(error.response?.data?.message || 'Failed to fetch tasks')
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Create a new task
     */
    async createTask(title) {
      if (!title || !title.trim()) {
        this.showErrorNotification('Task title cannot be empty')
        return false
      }

      try {
        const response = await axios.post('/tasks', { title: title.trim() })
        if (response.data?.success) {
          // Add new task to the list
          this.tasks.push(response.data.task)
          Notify.create({
            message: 'Task created successfully',
            color: 'positive',
            position: 'top',
            timeout: 2000,
          })
          return true
        } else {
          this.showErrorNotification(response.data?.message || 'Failed to create task')
          return false
        }
      } catch (error) {
        this.showErrorNotification(error.response?.data?.message || 'Failed to create task')
        return false
      }
    },

    /**
     * Update task title
     */
    async updateTask(taskId, title) {
      if (!title || !title.trim()) {
        this.showErrorNotification('Task title cannot be empty')
        return false
      }

      try {
        const response = await axios.put(`/tasks/${taskId}`, { title: title.trim() })
        if (response.data?.success) {
          // Update task in the list
          const index = this.tasks.findIndex(t => t.entity_id === taskId)
          if (index !== -1) {
            this.tasks[index] = response.data.task
          }
          return true
        } else {
          this.showErrorNotification(response.data?.message || 'Failed to update task')
          return false
        }
      } catch (error) {
        this.showErrorNotification(error.response?.data?.message || 'Failed to update task')
        return false
      }
    },

    /**
     * Toggle task completion status
     */
    async toggleTask(taskId) {
      const task = this.tasks.find(t => t.entity_id === taskId)
      if (!task) {
        this.showErrorNotification('Task not found')
        return false
      }

      const newCompletedStatus = !task.completed

      try {
        const response = await axios.patch(`/tasks/${taskId}/complete`, {
          completed: newCompletedStatus,
        })
        if (response.data?.success) {
          // Update task in the list
          const index = this.tasks.findIndex(t => t.entity_id === taskId)
          if (index !== -1) {
            this.tasks[index] = response.data.task
          }
          return true
        } else {
          this.showErrorNotification(response.data?.message || 'Failed to update task')
          return false
        }
      } catch (error) {
        this.showErrorNotification(error.response?.data?.message || 'Failed to update task')
        return false
      }
    },

    /**
     * Delete a task
     */
    async deleteTask(taskId) {
      try {
        const response = await axios.delete(`/tasks/${taskId}`)
        if (response.data?.success) {
          // Remove task from the list
          this.tasks = this.tasks.filter(t => t.entity_id !== taskId)
          Notify.create({
            message: 'Task deleted successfully',
            color: 'positive',
            position: 'top',
            timeout: 2000,
          })
          return true
        } else {
          this.showErrorNotification(response.data?.message || 'Failed to delete task')
          return false
        }
      } catch (error) {
        this.showErrorNotification(error.response?.data?.message || 'Failed to delete task')
        return false
      }
    },

    /**
     * Set filter
     */
    setFilter(filter) {
      this.filter = filter
      this.fetchTasks(filter)
    },

    /**
     * Show error notification
     */
    showErrorNotification(message) {
      Notify.create({
        message,
        color: 'negative',
        position: 'top',
        timeout: 5000,
      })
    },
  },
})

// Hot Module Replacement support
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot))
}

