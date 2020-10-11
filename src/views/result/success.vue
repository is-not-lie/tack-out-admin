<template>
  <a-result
    status="success"
    title="申请成功"
    sub-title="您的申请已成功提交,请耐心等待,工作人员将在 1-2 个工作日内完成审核"
  >
    <template #extra>
      <a-button key="console">
        上一步
      </a-button>
      <a-button key="buy" type="primary">
        前往客户端
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
