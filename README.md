## 豆瓣电影top250数据

### 背景

我想知道豆瓣电影top250有哪些是可以免费在线看的，出于好奇抓取并处理了下数据

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

```

```
