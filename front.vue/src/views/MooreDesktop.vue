<template>
  <div class="moore-desktop">
    <div class="icon pig">
      <i v-b-modal.modal1></i>
      <span>Un nom de document</span>
    </div>
    <div class="icon cow">
      <i v-b-modal.modal1></i>
      <span>Un nom de document</span>
    </div>
    <div class="icon cow">
      <i v-b-modal.modal1></i>
      <span>Un nom de document</span>
    </div>
    <div class="icon chick">
      <i v-b-modal.modal1></i>
      <span>Un nom de document</span>
    </div>
    <div class="icon pig">
      <i v-b-modal.modal1></i>
      <span>Un nom de document</span>
    </div>
    <div class="icon chick">
      <i v-b-modal.modal1></i>
      <span>Un nom de document</span>
    </div>
    <div class="icon chick">
      <i v-b-modal.modal1></i>
      <span>Un nom de document</span>
    </div>
    <div class="icon chick">
      <i v-b-modal.modal1></i>
      <span>Un nom de document</span>
    </div>
    <b-modal size="xl" hide-footer id="modal1" title="BootstrapVue">
      <img src="../assets/dashboard.jpg" />
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'moore-desktop',
}
</script>

<style lang="scss">
.moore-desktop {
  background: black;
  height: 100%;
  padding: 25px;
  cursor: initial;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  .icon {
    flex: 0 1 100px;
    display: inline-block;
    height: 150px;
    width: 75px;
    cursor: pointer;
    margin: 25px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &:hover i {
      filter: brightness(1.2);
    }
    &.cow i {
      background-image: url('../assets/cow.png');
      background-size: cover;
    }
    &.pig i {
      background-image: url('../assets/pig.png');
      background-size: cover;
    }
    &.chick i {
      background-image: url('../assets/chick.png');
      background-size: cover;
    }
    i {
      display: block;
      height: 75px;
      width: 75px;
      margin-bottom: .5em;
    }
    span {
      text-align: center;
      color: white;
      line-height: 1em;
    }
  }
  .modal-body {
    padding: 0;
    img {
      width: 100%;
    }
  }
  .modal-content {
    border: 2px solid violet;
    .modal-header {
      background: violet;
      color: white;
      padding: .5em;
      justify-content: center;
      h5 {
        flex: 1;
        text-align: center;
        font-size: 1em;
        font-weight: bold;
        line-height: 1;
        margin: 0;
      }
      .close {
        font-size: 1em;
        padding: 0;
        margin: 0;
      }
    }
  }
}
</style>
