<template>
  <div class="moore-session">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <form v-on:submit.prevent="authenticate">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" class="form-control" id="username" v-model="username" />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" class="form-control" id="password" v-model="password" />
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-primary btn-block">Authenticate</button>
            </div>
            <div class="alert alert-danger text-center" v-if="error">
              Username or password incorrect
            </div>
            <div class="alert alert-success text-center" v-if="success">
              Access granted
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'moore-session',
  data () {
    return {
      username: '',
      password: '',
      success: null,
      error: null
    }
  },
  methods: {
    authenticate () {
      if (this.username === 'escape' && this.password === 'game') {
        this.error = false
        this.success = true
        setTimeout(() => {
          this.$router.push({ name: 'moore-desktop' })
        }, 2000)
      } else {
        this.error = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.moore-session, .container {
  background: black;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  width: 50%;
  height: 320px;
}
</style>
