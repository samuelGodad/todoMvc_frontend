import { defineStore, acceptHMRUpdate } from 'pinia'
import { Notify } from 'quasar'
import axios from 'config/axios'

export const useTaskStore = defineStore('task', {
  state: () => {
    let initialSort = 'newest'
    try {
      const savedSort = localStorage.getItem('task_sort')
      if (
        savedSort &&
        ['newest', 'oldest', 'title_asc', 'title_desc', 'active_first', 'completed_first'].includes(
          savedSort,
        )
      ) {
        initialSort = savedSort
      }
    } catch {
      // ignore localStorage errors
    }

    return {
      tasks: [],
      filter: 'all', // 'all', 'active', 'completed'
      sort: initialSort,
      loading: false,
    }
  },

  getters: {
    activeTasks: (state) => state.tasks.filter((task) => !task.completed),
    completedTasks: (state) => state.tasks.filter((task) => task.completed),
    filteredTasks: (state) => {
      if (state.filter === 'active') {
        return state.tasks.filter((task) => !task.completed)
      } else if (state.filter === 'completed') {
        return state.tasks.filter((task) => task.completed)
      }
      return state.tasks
    },
    filteredAndSortedTasks: (state) => {
      let items = state.tasks
      if (state.filter === 'active') {
        items = state.tasks.filter((t) => !t.completed)
      } else if (state.filter === 'completed') {
        items = state.tasks.filter((t) => t.completed)
      }

      items = [...items]

      const getDate = (t) => {
        return t.changed_on || t.changedOn || t.created_at || t.createdAt || t._created_at || null
      }

      const cmpString = (a, b) => {
        if (!a && !b) return 0
        if (!a) return -1
        if (!b) return 1
        return a.toString().localeCompare(b.toString(), undefined, { sensitivity: 'base' })
      }

      switch (state.sort) {
        case 'newest':
          items.sort((a, b) => {
            const da = getDate(a)
            const db = getDate(b)
            if (!da && !db) return 0
            if (!da) return 1
            if (!db) return -1
            return new Date(db).getTime() - new Date(da).getTime()
          })
          break
        case 'oldest':
          items.sort((a, b) => {
            const da = getDate(a)
            const db = getDate(b)
            if (!da && !db) return 0
            if (!da) return 1
            if (!db) return -1
            return new Date(da).getTime() - new Date(db).getTime()
          })
          break
        case 'title_asc':
          items.sort((a, b) => cmpString(a.title, b.title))
          break
        case 'title_desc':
          items.sort((a, b) => cmpString(b.title, a.title))
          break
        case 'active_first':
          items.sort((a, b) => {
            if (a.completed === b.completed) return 0
            return a.completed ? 1 : -1
          })
          break
        case 'completed_first':
          items.sort((a, b) => {
            if (a.completed === b.completed) return 0
            return a.completed ? -1 : 1
          })
          break
        default:
          break
      }

      return items
    },
    tasksCount: (state) => state.tasks.length,
    activeTasksCount: (state) => state.tasks.filter((task) => !task.completed).length,
    completedTasksCount: (state) => state.tasks.filter((task) => task.completed).length,
  },

  actions: {
    /**
     */
    async fetchTasks(filter = 'all') {
      this.loading = true
      this.filter = filter
      try {
        const response = await axios.get('/tasks?filter=all')
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
          const index = this.tasks.findIndex((t) => t.entity_id === taskId)
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
      const task = this.tasks.find((t) => t.entity_id === taskId)
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
          const index = this.tasks.findIndex((t) => t.entity_id === taskId)
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
          this.tasks = this.tasks.filter((t) => t.entity_id !== taskId)
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
     * Set filter (no need to refetch, we already have all tasks)
     */
    setFilter(filter) {
      this.filter = filter
    },

    setSort(sortKey) {
      this.sort = sortKey
      try {
        localStorage.setItem('task_sort', sortKey)
      } catch {
        // ignore
      }
    },

    /**
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

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot))
}
