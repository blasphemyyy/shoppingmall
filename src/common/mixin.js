import {POP, NEW, SELL} from "./const";

export const backTopMixin = {
  data: function () {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick: function () {
      this.$refs.scroll.scrollTo(0, 0, 300);
    }
  }
}

export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      console.log(this.currentType);
    }
  }
}

export const itemListenerMixin={
  data(){
    return {
      itemImageListener:null
    }
  },
  mounted(){
    //1.图片加载完成事件监听
    this.itemImageListener=()=>{
        this.$refs.scroll.refresh()}
    this.$bus.$on('itemImageLoad',this.itemImageListener
    )
},
}
