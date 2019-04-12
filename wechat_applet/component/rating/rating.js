
Component({
  properties: {
    /* 显示有色星星的个数 */
    value: {
      type: Number,
      value: 0,
      /* 监听value值的变化 */
      observer: function (newVal, oldVal, changedPath) {
        this.init()
      }
    },
    /* 设置星星大小 */
    size: {
      type: Number,
      value: 30
    },
    /* 是否可点击，type为null表示值可以是任意类型 */
    isClick: {
      type: null,
      value: false
    }
  },
  attached() {
    /* 组件生命周期函数，在组件实例进入页面节点树时执行 */
    this.init();
  },
  data: {
    stars: [0, 0, 0, 0, 0]
  },
  methods: {
    init() {
      let star = this.properties.value;
      let stars = [0, 0, 0, 0, 0];
      /* 图片名称，通过设置图片名称来动态的改变图片显示 */
      for (let i = 0; i < Math.floor(star); i++) {
        stars[i] = 'star';
      }
      if (star > Math.floor(star)) {
        stars[Math.floor(star)] = 'halfStar';
      }
      for (let i = 0; i < stars.length; i++) {
        if (stars[i] == 0) {
          stars[i] = 'grayStar';
        }
      }
      this.setData({
        stars
      })
    },
    /* 可点击时，用于计算分数 */
    computeScore(e) {
      let index = e.currentTarget.dataset.index;
      let isClick = this.data.isClick;
      if (isClick) {
        let score = index + 1;
        this.triggerEvent('compute', {
          score
        });
      }
    }
  }
})

