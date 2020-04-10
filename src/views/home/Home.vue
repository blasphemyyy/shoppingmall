<template>
    <div id="home" class="wrapper">
        <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
        <tab-control :titles="['流行','新款','精选']"
                     @tabClick="tabClick"
                     ref="tabControl1"
                     class="tab-control"
                     v-show="isTabFixed"/>
        <scroll class="content" 
                ref="scroll" 
                :probe-type="3"
                @scroll="contentScroll"
                :pull-up-load="true"
                @pullingUp="loadMore"
         >
            <home-swiper :banners="banners"
                         @swiperImageLoad="swiperImageLoad"></home-swiper>
            <recommend-view :recommends="recommends"></recommend-view>
            <feature-view></feature-view>
            <tab-control :titles="['流行','新款','精选']"
                     @tabClick="tabClick"
                     ref="tabControl2"/>
            <goods-list :goods="goods[currentType].list"></goods-list>
        </scroll>
        <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>    
     
    </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'


import {getMultiData,getGoodsData} from 'network/home'
import {itemListenerMixin} from '@/common/mixin'
export default {
    name:"Home",
    components:{
        NavBar,
        HomeSwiper,
        RecommendView,
        FeatureView,
        TabControl,
        GoodsList ,
        Scroll,
        BackTop
    },
    mixins:[itemListenerMixin],
    data(){
        return{
        banners:[],
        recommends:[],
        goods:{
            'pop':{page:0,list:[]},
            'new':{page:0,list:[]},
            'sell':{page:0,list:[]},
        },
        currentType:'pop',
        isShowBackTop:false,
        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0,
        
        }
    },
    created(){
        this.getMultiData()

        this.getGoodsData('pop')
        this.getGoodsData('new')
        this.getGoodsData('sell')
    },
    activated(){
        this.$refs.scroll.scrollTo(0,this.saveY,300)
        this.$refs.scroll.refresh()
    },
    deactivated(){
        //1.保存y值
        this.saveY=this.$refs.scroll.scroll.y
        //2.取消全局事件监听
        this.$bus.$off('itemImageLoad',this.itemImageListener)
    },
    methods:{
        //事件监听方法
        tabClick(index){
            switch(index){
                case 0:
                this.currentType='pop'
                break
                case 1:
                this.currentType='new'
                break
                case 2:
                this.currentType='sell'
            }
            this.$refs.tabControl1.currentIndex=index;
            this.$refs.tabControl2.currentIndex=index;
        },
        backClick(){
            this.$refs.scroll.scrollTo(0,0,500)
        },
        contentScroll(position){
            //1.判断backtop是否显示
            this.isShowBackTop=(-position.y)>1000

            //2.判断tabcontrol是否吸顶
            this.isTabFixed=(-position.y)>this.tabOffsetTop
        },
        loadMore(){
            this.getGoodsData(this.currentType)

            this.$refs.scroll.refresh()
        },
        swiperImageLoad(){
            // console.log(this.$refs.tabControl.$el.offsetTop)
            this.tabOffsetTop=this.$refs.tabControl2.$el.offsetTop
        },



        //网络请求相关方法
        getMultiData(){
            getMultiData().then(res=>{
            this.banners=res.data.banner.list
            this.recommends=res.data.recommend.list
            })
            },
        getGoodsData(type){
            const page=this.goods[type].page+1
             getGoodsData(type,page).then(res=>{
                 console.log(res)
                 this.goods[type].list.push(...res.data.list)
                 this.goods[type].page++

                 this.$refs.scroll.finishPullUp()
             })       
        }
    }
}
</script>

<style scoped>
.home-nav{
    background-color:salmon;
    color:white;
/*     
    position: fixed;
    left:0;
    right:0;
    top:0;
    z-index:9; */
}
#home{
    position: relative;
    height: 100vh;
    
}
.content{
    overflow: hidden;
    /* height: 300px; */
    /* height:calc(100% - 93px); */
    position: absolute;
    top:44px;
    bottom:49px;
    left: 0;
    right: 0;
}
.tab-control{
    position: relative;
    z-index:9;
}
</style>