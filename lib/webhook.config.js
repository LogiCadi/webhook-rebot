// webhook template list
module.exports = {
  deployed: {
    url: "https://qyapi.weixdd",
    content: `### <font color='info'>Deployed successfully</font>
——————————————
**project** $1
**branch** $2
**deploy** $3
**publisher** $4`,
  },
};
