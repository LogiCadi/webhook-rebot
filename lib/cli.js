const fs = require("fs");
const path = require("path");
const axios = require("axios");
const configFilename = "webhook.config.js";

main();
function main() {
  if (!getCommand().content[0]) return showHelp();

  if (getCommand().content[0] === "init") return initConfig();

  const config = readConfig();
  console.log(config);
  if (config) {
    axios.post(config.url, {
      msgtype: "markdown",
      markdown: {
        content: config.content,
      },
    });
  }
}

function getCommand() {
  const args = process.argv.slice(2);
  const res = { content: [], operate: {} };
  for (const v of args) {
    if (v.indexOf("=") !== -1) {
      res.operate[v.split("=")[0]] = v.split("=")[1];
    } else {
      res.content.push(v);
    }
  }
  return res;
}

function showHelp() {
  const package = require("../package.json");
  console.log(
    `
     > webhook-rebot v${package.version} <

     webhook-rebot init               -初始化配置文件
     webhook-rebot [keys] [params...] -执行webhook发送

     请参考 https://www.npmjs.com/package/webhook-rebot
    `
  );
}

/** init config file */
function initConfig() {
  const exists = fs.existsSync(path.join(process.cwd(), configFilename));
  if (exists) {
    return console.log(configFilename + " 配置文件已存在，请先手动删除它");
  }
  const template = fs.readFileSync(path.join(__dirname, configFilename));
  fs.writeFileSync(path.join(process.cwd(), configFilename), template);
  console.log(configFilename + " 配置文件已生成");
}

/** read config file */
function readConfig() {
  try {
    let config;
    if (getCommand().operate["config"]) {
      // 指定config文件
      config = require(getCommand().operate["config"]);
    } else {
      // 默认执行目录下的config文件
      config = require(path.join(process.cwd(), configFilename));
    }

    config = config[getCommand().content[0]];
    for (let i = 1; i < getCommand().content.length; i++) {
      config.content = config.content.replace(`$${i}`, getCommand().content[i]);
    }

    return config;
  } catch (error) {
    console.log(
      "配置文件读取失败，请检查，或执行webhook-rebot init生成配置文件"
    );
  }
}

module.exports = { getCommand };
