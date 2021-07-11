const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
let data = [];
let listIndex = 0;
const total = 250;
const saveFileName = 'movieTop250.json';
const config = require('./config');
const Cookie = `dbcl2="${config.dbcl2}"`;

// 影片信息对象类定义
class MovieObj {
  title = ''; // 片名
  year = 0; // 年份
  picUrl = ''; // 封面
  topNo = 0; // 排名
  score = 0; // 评分
  votes = 0; // 评价数
  duration = 0; // 片长
  playType = 3; // 可播放状态, 1 免费, 2 需要会员, 3 无在线播放
  genres = []; // 类型
  areas = []; // 地区
  languages = []; // 语言
  directors = []; // 导演
  writers = []; // 编剧
  constructor(url) {
    this.url = url; // 页面链接
  }
}

/**
 * 获取列表
 */
async function getList() {
  let url = `https://movie.douban.com/top250?start=${listIndex}&filter=`;
  try {
    let res = await axios({
      url,
      headers: {
        Cookie,
      },
    });
    let $ = cheerio.load(res.data, {
      xml: {
        normalizeWhitespace: true,
      },
    });
    let list = $('.grid_view .item .pic a');
    for (let i = 0, len = list.length; i < len; i++) {
      let url = $(list[i]).attr('href');
      let index = i + listIndex + 1;
      console.log('处理进度', index + '/' + total);
      try {
        await getPage(url);
        console.log('已完成', Number((index / total) * 100).toFixed(1) + '%');
      } catch (err) {
        console.log(err);
        return;
      }
    }
    listIndex += list.length;
    if (listIndex < total) {
      getList();
    } else {
      saveData();
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * 分析详情页
 * @param {*} url
 */
function getPage(url) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      console.log(url);
      try {
        let res = await axios({
          url,
          headers: {
            Cookie,
          },
        });
        let $ = cheerio.load(res.data, {
          xml: {
            normalizeWhitespace: true,
          },
        });
        console.log($);
        let movieObj = new MovieObj(url);
        // 标题
        movieObj.title = $('[property="v:itemreviewed"]').text();
        // 年份
        movieObj.year = +$('.year')
          .text()
          .match(/\((.*)\)/)[1];
        // 封面
        movieObj.picUrl = $('[rel="v:image"]').attr('src');
        // 排名
        movieObj.topNo = +$('.top250-no').text().split('.')[1];
        // 评分
        movieObj.score = +$('[property="v:average"]').text();
        // 评分数
        movieObj.votes = +$('[property="v:votes"]').text();
        // 片长
        movieObj.duration = +$('[property="v:runtime"]').attr('content');
        // 可播放状态
        let onlinePlayStatus = $('.buylink-price').text().match(/\S+/g);
        if (onlinePlayStatus) {
          let isFree = onlinePlayStatus.find((item) => item == '免费观看');
          if (isFree) {
            movieObj.playType = 1;
          } else {
            movieObj.playType = 2;
          }
        }
        // 类型
        movieObj.genres = $('[property="v:genre"]')
          .map((index, item) => $(item).text())
          .get();
        // 地区
        let areaStr = $('span:contains("地区:")')[0].next.data;
        movieObj.areas = areaStr.match(/\S+/g).join('').split('/');
        // 语言
        let langStr = $('span:contains("语言:")')[0].next.data;
        movieObj.languages = langStr.match(/\S+/g).join('').split('/');
        // 导演
        movieObj.directors = $('[rel="v:directedBy"]')
          .map((index, item) => $(item).text())
          .get();
        // 编剧
        movieObj.writers = $('span:contains("编剧")')
          .next()
          .children()
          .map((index, item) => $(item).text())
          .get();
        if (movieObj.writers[movieObj.writers.length - 1] == '&copy;豆瓣') {
          movieObj.writers.pop();
        }
        // 输出
        data.push(movieObj);
        console.log(movieObj);
        resolve();
      } catch (err) {
        reject(err);
      }
    }, 1000);
  });
}

/**
 * 保存数据
 */
function saveData() {
  fs.writeFileSync(saveFileName, JSON.stringify(data), 'utf8');
  console.log('保存成功!');
}

// run
getList();
