<template>
<div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" ></detail-nav-bar>
    <scroll class="content" 
            ref="scroll" 
            @scroll="contentScroll"
            :probe-type="3">
        <detail-swiper :top-images="topImages"></detail-swiper>
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo" @imgLoad="imgLoad"></detail-goods-info>
        <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
        <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
        <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>  
</div>
  
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backTop/BackTop'

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
import {itemListenerMixin,backTopMixin} from '@/common/mixin'
export default {
  name: 'Detail',
  data(){
      return {
          iid:null,
          topImages:[],
          goods:{},
          shop:{},
          detailInfo:{},
          paramInfo:{},
          commentInfo:{},
          recommends:[],
          themeTopYs:[],
          currentIndex:0
      }
  },
  mixins:[itemListenerMixin,backTopMixin],
  components:{
       DetailNavBar,
       DetailSwiper,
       DetailBaseInfo,
       DetailShopInfo,
       DetailGoodsInfo,
       DetailParamInfo,
       DetailCommentInfo,
       GoodsList,
       DetailBottomBar,
       Scroll,
       BackTop
  },
  methods:{
      imgLoad(){
          this.$refs.scroll.refresh()

          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop-44)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44)
          this.themeTopYs.push(Number.MAX_VALUE)
          
      },
      titleClick(index){
          this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
      },
      contentScroll(position){
          //1.获取y值
          const positionY=-position.y

          //2.positiony 与themetopy的四个值比较
          let length=this.themeTopYs.length
          for(let i=0;i<length-1;i++){
              if(this.currentIndex!=i&&(positionY>=this.themeTopYs[i]&&positionY<this.themeTopYs[i+1]))
              this.currentIndex=i
              this.$refs.nav.currentIndex=this.currentIndex
          }

          //3.是否显示backtop
           this.isShowBackTop=(-position.y)>1000
      },
      addToCart(){
          //1.获取购物车需要展示的信息
          const product={}
          product.image=this.topImages[0]
          product.title=this.goods.title
          product.desc=this.goods.desc
          product.price=this.goods.lowNowPrice
          product.iid=this.iid

          //2.将商品添加到购物车
          this.$store.commit('addCart',product)
      }
  },
  created(){
    //   console.log(this.$route.params)
    //1.保存传入的iid
      this.iid=this.$route.params.iid

    //2.根据iid请求详细数据
    getDetail(this.iid).then(res=>{
        console.log(res)
        //1.轮播图数据获取
        const data=res.result
        this.topImages=data.itemInfo.topImages

        //2.获取商品数据
        this.goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services)

        //3.店铺信息
        this.shop = new Shop(data.shopInfo)

        //4.商品详细信息
        this.detailInfo=data.detailInfo

        //5.参数信息
        this.paramInfo=new GoodsParam(data.itemParams.info,data.itemParams.rule)

        //6.评论信息
        if(data.rate.cRate!==0){
            this.commentInfo=data.rate.list[0]
        }

    })

    //3.获取推荐数据
    getRecommend().then(res=>{
        // console.log(res)
        this.recommends=res.data.list
    })
  },
  destroyed(){
       this.$bus.$off('itemImageLoad',this.itemImageListener)
  }
}
</script>

<style scoped>
#detail{
    position: relative;
    z-index:9;
    background-color: #fff;
    height: 100vh;
}
.content{
    height: calc(100% - 100px );
}
.detail-nav{
    position: relative;
    z-index:9;
    background-color: #fff;
}
</style>
