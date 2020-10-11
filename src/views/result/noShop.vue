<template>
  <a-result status="403" title="403" sub-title="抱歉,您的权限不足!">
    <template #extra>
      <a-button type="primary" @click="$router.replace('/signin')">
        成为商家?
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>
