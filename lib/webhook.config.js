// webhook template list
module.exports = {
  deployed: {
    url: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx",
    content: `### <font color='info'>部署完成</font> [#_1](http://xxx:8080/job/_2/_1/)
**project** _2
**branch** _3
**deploy** _6
**publisher** _4`,
  },
  deployedFail: {
    url: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx",
    content: `### <font color='warn'>部署失败</font> [#_1](http://xxx:8080/job/_2/_1/)
**project** _2
**branch** _3
**deploy** _6
**publisher** _4`,
  },
};
