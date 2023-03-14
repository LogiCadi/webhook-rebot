const fs = require("fs");
const open = require("open");
const path = require("path");
const axios = require("axios");

const templatePath = path.join(__dirname, "webhook.config.js");
const configPath = path.join(process.env.HOME || process.env.USERPROFILE, "webhook.config.js");

if (!getCommand().content[0]) return showHelp();
if (getCommand().content[0] === "config") return editConfig();

const config = readConfig();
if (config) {
  console.log(`发送内容\n${config.content}`);
  axios.post(config.url, {
    msgtype: "markdown",
    markdown: {
      content: config.content,
    },
  });
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

     webhook-rebot config             -编辑配置文件
     webhook-rebot [keys] [params...] -执行webhook发送

     请参考 https://www.npmjs.com/package/webhook-rebot
    `
  );
}

function editConfig() {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, fs.readFileSync(templatePath));
  }
  open(configPath);
}

function readConfig() {
  try {
    let config = require(configPath);

    config = config[getCommand().content[0]];

    for (let i = 1; i < getCommand().content.length; i++) {
      config.content = config.content.replace(new RegExp(`_${i}`, "g"), getCommand().content[i]);
    }

    return config;
  } catch (error) {
    console.log("配置文件读取失败，请检查\n", error);
  }
}

module.exports = { getCommand };
