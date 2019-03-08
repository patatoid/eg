<template>
  <div class="moore-desktop">
    <div class="icon pig">
      <i v-b-modal.family></i>
      <span>Family.jpg</span>
    </div>
    <div class="icon cow">
      <i v-b-modal.mooreCrisis></i>
      <span>Moore crisis.pdf</span>
    </div>
    <div class="icon cow">
      <i v-b-modal.mooreNucleaReport></i>
      <span>Moore Nuclea Report.pdf</span>
    </div>
    <div class="icon chick">
      <i v-b-modal.messenger></i>
      <span>Messenger</span>
    </div>
    <b-modal :no-fade="true" no-close-on-backdrop hide-backdrop size="xl" hide-footer id="messenger" title="Messenger">
      <img src="../assets/messenger.png" />
    </b-modal>
    <b-modal :no-fade="true" no-close-on-backdrop hide-backdrop size="xl" hide-footer id="family" title="Family.jpg">
      <img src="../assets/family.jpg" />
    </b-modal>
    <b-modal :no-fade="true" no-close-on-backdrop hide-backdrop size="xl" hide-footer id="mooreCrisis" title="Moore crisis.pdf">
      <iframe src="/pdf/moore-crisis.pdf" />
    </b-modal>
    <b-modal :no-fade="true" no-close-on-backdrop hide-backdrop size="xl" hide-footer id="mooreNucleaReport" title="Moore Nuclea report.pdf">
      <iframe src="/pdf/moore-nuclea-report.pdf" />
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
  background-size: cover;
  height: 100%;
  padding: 25px;
  cursor: initial;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  user-select: none;
  .icon {
    flex: 0 1 130px;
    display: inline-block;
    height: 75px;
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
  #messenger {
    img {
      width: 100%;
      height: auto;
    }
    .modal-body {
      display: block;
      overflow-y: scroll;
    }
  }
  .modal-body {
    padding: 0;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    iframe, img {
      width: 100%;
      height: 80vh;
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
