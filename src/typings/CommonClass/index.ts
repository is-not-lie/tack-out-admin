import Vue from 'vue'

export class Hours extends Vue {
  collapsed = false

  get pm () {
    const hours = new Date().getHours()
    return hours >= 6 && hours < 19
  }
}
