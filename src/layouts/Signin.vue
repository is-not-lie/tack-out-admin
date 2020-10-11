<script lang='jsx'>

export default {
  render () {
    return (
      <section class="signin-container">
        <section class="signin-form">
          <router-view />
        </section>
      </section>
    )
  }
}
</script>

<style lang='scss' scoped>
.signin-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  background-image: url('~img/signin_bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  @extend .flex;
  .signin-form {
    padding: 20px;
    border-radius: 10px;
    background-color: rgba($color: $bg-color, $alpha: .4);
    padding: 20px;
    backdrop-filter: blur(3px) brightness(100%);
    border-radius: 10px;
    box-shadow: 0 0 20px rgba($color: $bg-color, $alpha: .5);
  }
}
</style>
