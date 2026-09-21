/* =========================================================
   Ufinite 数据中心
   data.js

   这里负责保存：
   1. 相册
   2. 回忆录
   3. 网站的一些基础数据
========================================================= */


/* =========================================================
   1. 相册数据
========================================================= */

const photos = [

    {
        file: "202609111.jpg",
        date: "2026.09.11",
        title: "First Dinner：wmt200元蛋炒饭",
        type: "landscape"
    },

    {
        file: "202609112.jpg",
        date: "2026.09.12",
        title: "给小猫照镜子",
        type: "portrait"
    },

    {
        file: "202609121.jpg",
        date: "2026.09.12",
        title: "First Date：上海共青公园",
        type: "portrait"
    },

    {
        file: "202609123.jpg",
        date: "2026.09.12",
        title: "梧桐与🍁",
        type: "portrait"
    },

    {
        file: "202609124.jpg",
        date: "2026.09.12",
        title: "波光粼粼的静谧油画",
        type: "landscape"
    },

    {
        file: "202609122.jpg",
        date: "2026.09.12",
        title: "一起做的晚饭：有咸醋排骨",
        type: "landscape"
    },

    {
        file: "202609125.jpg",
        date: "2026.09.12",
        title: "Monopoly!",
        type: "landscape"
    },

    {
        file: "202609131.jpg",
        date: "2026.09.13",
        title: "First KTV：嗯？？好像有人动嘴",
        type: "landscape"
    },

    {
        file: "202609141.jpg",
        date: "2026.09.14",
        title: "童童的云",
        type: "portrait"
    },

    {
        file: "202609142.jpg",
        date: "2026.09.14",
        title: "洲洲的云",
        type: "portrait"
    },

    {
        file: "secret/202609201.jpg",
        date: "2026.09.21",
        title: "线上100Days【仅离线】",
        type: "portrait"
    }

];


/* =========================================================
   2. 回忆录数据
========================================================= */

const memories = [

    {
        date: "2020.03.30",
        title: "Ufinite正式成立",
        text: "有人想当鸭子的爸爸？？不能理解"
    },

    {
        date: "2026.09.06.凌晨",
        title: "我们关系的开始",
        text: "wmt口出狂言。"
    },

    {
        date: "2025.09.11-13",
        title: "第一次约会",
        text: "上海共青森林公园"
    }

];


/* =========================================================
   3. 网站基础配置
========================================================= */

const siteConfig = {

    // 关系开始时间
    loveStartDate: "2026-09-06",

    // 图片文件夹
    imagePath: "images/",

    // 是否自动滚动相册
    autoScroll: true,

    // 自动滚动速度
    autoScrollSpeed: 0.6

};