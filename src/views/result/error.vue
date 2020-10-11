<template>
  <a-result
    status="error"
    title="申请失败"
    sub-title="申请提交失败"
  >
    <template #extra>
      <a-button key="console">
        上一步
      </a-button>
      <a-button key="buy" type="primary">
        重新提交
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

<style scoped>

</style>
