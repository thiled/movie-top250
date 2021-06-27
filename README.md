## 豆瓣电影top250数据

### 背景

我想知道豆瓣电影top250有哪些是可以免费在线看的，出于好奇读取并处理了下数据

### 获取数据
仓库中的movieTop250.json为提交时的存档，有需要可自行跑脚本获取最新数据  
#### 安装依赖
```
npm i
```
#### 修改index.js中的Cookie值
```
const Cookie = 'dbcl2="xxx"'; // dbcl2值，浏览器登录douban后从cookie获取，必须设置，否则会被豆瓣拦截请求
```
#### 运行
```
node index.js
```

### 影片信息数据结构

```
{
	url: String, // 豆瓣链接地址
	title: String, // 片名
	year: Number, // 年份
	picUrl: String, // 封面图片地址
	topNo: Number, // 排名
	score: Number, // 评分
	votes: Number, // 评价数
	duration: Number, // 片长
	playType: Number, // 可播放状态 0 无在线, 1 免费, 2 需要会员
	genres: Array, // 类型
	areas: Array, // 地区
	languages: Array, // 语言
	directors: Array, // 导演
	writers: Array, // 编剧
}
```

