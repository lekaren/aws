const { default: Axios } = require('axios');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let a = []
  Axios.get('https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=0fdf1d1c60aa4905a6587398591425a7&Type=json&ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7530336&MLSV_YMD=20201030')
  .then(res => res.data.mealServiceDietInfo[1].row[0].DDISH_NM)
  .then(res => {
    var test = res.toString();
    for(let i = 0; i < test.split("<br/>").length; i++){
      a.push(test.split("<br/>")[i].match(/[^(삼일)]/g).join('').match(/[가-힣]/g).join(''))
    }
  })
  .then(response => res.render('index', { title: 'Express' , data:a }))
});

module.exports = router;
