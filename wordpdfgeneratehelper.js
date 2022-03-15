var https = require('https')
const CloudConvert = require('cloudconvert');
const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzIyYWNlZDQyYjUxZDBkYzBiZDc2ZjJlNGFjNjcyNjliODdjOTc1ZjFkNGMxNWI3MDY1NTFjNDUyNDBlMTBhMDRkNTdjMmI3ZTU4N2NiMmMiLCJpYXQiOjE2MjUyMjQ0NzcuODQyMTQ2LCJuYmYiOjE2MjUyMjQ0NzcuODQyMTQ4LCJleHAiOjQ3ODA4OTgwNzcuODAyNDE0LCJzdWIiOiI1MjEwODQ1MCIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sud3JpdGUiLCJ3ZWJob29rLnJlYWQiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.knKISlX-6ziRPWjjeoUgpIckaayaGCRgyNLTNUdgQ39BBPT7Y39XflnUIP0zvnp5TXOZSApD8VfDZuuTglVviBcPCvqYbSJD17r7bbeVjKtsaM3xIkera5kvjmRkmivyuR6tW1g69bjZ2pAJXcNn7D7YNAf6km3S_Oiy1-z3SR5A_ZWXAi07jkIfjNmx5U4NONSzrnjCnIeEMdaAG8nKukx-siKrJO6tdN8F7fgQUadWP1Ww1leidXwQXeeb0T9fhElvP-UOft92BT9cvPYXwPA_rx0tlYdnyTptGDYZmxEsALbocknHYd9PfuB6A-0rZTInB0Tx3MGy9VrOvBfqhBqw2Bi-RN6fqeOnUZssTgSlow1M_huHAVvPy4Yq7cfl1x32e3nqV4UH2htVVY1MyGksuIe6dtvPTK13usgMPTAnqQ9fOesqGAnmVQGmtX4dEhm7BD9SDeR6nhGe29dr26f6DAf4HJJnxSc2RJjiNGviqY0fjsX1S9kCiTRSUvFVulLjDN1UbMRcMq7fMCLSFapm18Op_zvelMhS2c2Cjo-Ifpdh4-ClSlfjcsHqG0d_6jDbHFiI5rsvUmTKe5UzqmE8pyMZZUhtlyNEfiQIdRJPaTGb4bCxjiTUzF7oeVngAVLQYVGo7cgkD8OPs_6Ug8_8H7GQk7GLl9L6HKjZXM8');
var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');
var helper = require('./numberCalc')
const mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var reportData = require('./reportFormulation.json')


//var url = "mongodb://localhost:27017/numero"
url = "mongodb+srv://shourya123:shourya123@ellipcluster.ar2u2.mongodb.net/numero1?retryWrites=true&w=majority"

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
var db = mongoose.connection;

var Schema = mongoose.Schema;
var userSchema = new Schema({
  name: String,
  lname: String,
  email: String,
  dob: String,
  tob: String,
  gender: String,
  country: String,
  twinsOrTriplets: String,
  fatherDOB: String,
  motherDOB: String,
  user: String,
  generatedAt: String,
  pdfName: String
});


var User = mongoose.model("data", userSchema); //mongoose creates collection with an 's' so collection name will will be datas

// async function my(params) {
exports.my = async function (data, credentials) {

  lang={
    Malay:{
      Yes:"Ya",
      No:"Tidak",
      Female:"Perempuan",
      Male:"Jantan",
      first_Twin:"Kembar (anak) sulung",
      second_Twin:"Kembar (anak) kedua",
      Triplet:"Kembar tiga",
      OK:"                OKEY ",
      EXCESSIVE:"     BERLEBIHAN",
      MISSING:"             HILANG  "
    },
    English:{
      Yes:"Yes",
      No:"No",
      Female:"Female",
      Male:"Male",
      first_Twin:"1st Twin",
      second_Twin:"2nd Twin",
      Triplet:"Triplet",
      OK:"                  OK   ",
      EXCESSIVE:"          EXCESSIVE",
      MISSING:"             MISSING "
    },
    Chinese:{
      Yes:"有",
      No:"没有",
      Female:"女性",
      Male:"男性",
      first_Twin:"第一胎",
      second_Twin:"第二胎",
      Triplet:"第三胎",
      OK:"                 好 ",
      EXCESSIVE:"             过多",
      MISSING:"                缺少"
    }
  }

  var feed = {}
  if (data.gender == 'Male') {
    feed['q'] = 'Mr'
  } else {
    feed['q'] = 'Ms'
  }
  feed['first_name'] = data.name
  feed['last_name'] = data.lname
  feed['gender'] = lang[data.lang][data.gender]
  feed['twintrip'] = lang[data.lang][data.twinsOrTriplets]
  feed['user'] = credentials.fullname

  console.log(data.twinsOrTriplets);
  console.log(lang[data.lang][data.twinsOrTriplets]);

  var now = new Date()



  feed['pd1'] = now.getDate()
  // feed['pd2'] = typeof(now.getDate().toString()[1])=='undefined'?now.getDate().toString()[0]:now.getDate().toString()[1]
  feed['pm1'] = now.getMonth() + 1
  // feed['pm2'] = now.getMonth().toString()[1]
  feed['yy'] = now.getFullYear().toString()

  let job = await cloudConvert.jobs.create({
    tasks: {
      'upload-my-file': {
        operation: 'import/upload',

      },
      'convert-my-file': {
        operation: 'convert',
        input: 'upload-my-file',
        input_format: "docx",
        output_format: 'pdf',
        // some_other_option: 'value'
      },
      'export-my-file': {
        operation: 'export/url',
        input: 'convert-my-file'
      }
    }
  });





  var dob = data.dob
  var tob = data.timeofbirth
  // console.log(dob[0]);

  async function calculator() {



    //   unaltered dob
    var dat = dob.split('-').reverse();

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse();
      var mdob = data.mdob.split('-').reverse();
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse();
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse();
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }

    // console.log(day[2].substring(2,4),);

    var dobcal = await helper.numCal(day)

    // chart 1
    feed['d1'] = dat[0].split('')[0]
    feed['d2'] = dat[0].split('')[1]
    feed['mm'] = dat[1].split('').join('   ')
    feed['y1'] = dat[2].split('')[0]
    feed['y2'] = dat[2].split('')[1]
    feed['y3'] = dat[2].split('')[2]
    feed['y4'] = dat[2].split('')[3]
    feed['r11'] = dobcal.b[0]
    feed['r12'] = dobcal.b[1]
    feed['r13'] = dobcal.b[2]
    feed['r14'] = dobcal.b[3]
    feed['r21'] = dobcal.c[0]
    feed['r22'] = dobcal.c[1]
    feed['r31'] = dobcal.d[0]
    feed['r32'] = dobcal.d[1]
    feed['r33'] = dobcal.d[2]
    feed['r34'] = dobcal.d[3]
    feed['r35'] = dobcal.d[4]
    feed['r3l'] = await helper.recursive([dobcal.d[0] + dobcal.d[1]])
    feed['r3r'] = await helper.recursive([dobcal.d[3] + dobcal.d[4]])
    feed['r41'] = dobcal.e[0]
    feed['r42'] = dobcal.e[1]
    feed['r51'] = dobcal.f[0]
    feed['r61'] = dobcal.g[0]
    feed['r62'] = dobcal.g[1]
    feed['r71'] = dobcal.h[0]

    // hidden potential
    feed['hpi'] = await helper.recursive([+feed['r12'] + +feed['r13'] + ''])
    feed['hpb'] = await helper.recursive([+feed['r11'] + +feed['r14'] + +feed['r33'] + ''])

    // hidden talent

    feed['ht1'] = await helper.recursive([(+feed['r12'] + +feed['r13']) * 2 + ''])
    feed['ht2'] = await helper.recursive([+feed['r11'] + +feed['r14'] + +feed['r33'] + ''])
    feed['ht3'] = await helper.recursive([+feed['r11'] + +feed['r12'] + +feed['r21'] + ''])
    feed['ht4'] = await helper.recursive([+feed['r13'] + +feed['r14'] + +feed['r22'] + ''])
    feed['ht5'] = await helper.recursive([+feed['r21'] + +feed['r22'] + +feed['r33'] + ''])
    // life code

    feed['lc1'] = await helper.recursive([+feed['r33'] + +feed['r41'] + ''])
    feed['lc2'] = await helper.recursive([+feed['r41'] + +feed['r51'] + ''])
    feed['lc3'] = await helper.recursive([+feed['r33'] + +feed['r42'] + ''])
    feed['lc4'] = await helper.recursive([+feed['r42'] + +feed['r51'] + ''])

    // 

    feed['s'] = await helper.recursive([(+feed['r12'] + +feed['r13']) * 2 + ''])


    // chart 2
    tob = tob.split(':')
    day[2] = tob[0]
    day[3] = tob[1]
    var tobcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    feed['t1'] = tobcal.a[2][0]
    feed['t2'] = tobcal.a[2][1]
    feed['t3'] = tobcal.a[3][0]
    feed['t4'] = tobcal.a[3][1]
    feed['t11'] = tobcal.b[0]
    feed['t12'] = tobcal.b[1]
    feed['t13'] = tobcal.b[2]
    feed['t14'] = tobcal.b[3]
    feed['t21'] = tobcal.c[0]
    feed['t22'] = tobcal.c[1]
    feed['t31'] = tobcal.d[0]
    feed['t32'] = tobcal.d[1]
    feed['t33'] = tobcal.d[2]
    feed['t34'] = tobcal.d[3]
    feed['t35'] = tobcal.d[4]
    feed['t3l'] = await helper.recursive([tobcal.d[0] + tobcal.d[1]])
    feed['t3r'] = await helper.recursive([tobcal.d[3] + tobcal.d[4]])
    feed['t41'] = tobcal.e[0]
    feed['t42'] = tobcal.e[1]
    feed['t51'] = tobcal.f[0]
    feed['t61'] = tobcal.g[0]
    feed['t62'] = tobcal.g[1]
    feed['t71'] = tobcal.h[0]


    // page 3 "ABOUT"

    var ObjreportData = JSON.parse(JSON.stringify(reportData))

    feed['ucInfo1'] = ObjreportData['UC info 1'][data.lang][feed['r33']]
    feed['ucInfo2'] = ObjreportData['UC info 2'][data.lang][feed['r33']]
    feed['rval'] = ObjreportData['R'][data.lang][feed['r33']]
    feed['qval'] = ObjreportData['Q'][data.lang][feed['r22']]
    feed['ucInfo3'] = ObjreportData['UC info 3'][data.lang][feed['r33']]
    feed['describe'] = ObjreportData['Describe'][data.lang][feed['r33']]
    feed['ucInfo4'] = ObjreportData['UC info 4'][data.lang][feed['r33']]
    feed['hiddenPotentialBlindSpot'] = ObjreportData['hidden-potential-blindspot'][data.lang][feed['hpb']]
    feed['hiddenPotentialIntuition'] = ObjreportData['hidden-potential-intuition'][data.lang][feed['hpi']]

    // page 4 Interpretation of missing or excess code

    feed['icq1'] = 0
    feed['icq2'] = 0
    feed['icq3'] = 0
    feed['icq4'] = 0
    feed['icq5'] = 0
    feed['icq6'] = 0
    feed['icq7'] = 0
    feed['icq8'] = 0
    feed['icq9'] = 0


    feed['icr1'] = '           '
    feed['icr2'] = '           '
    feed['icr3'] = '           '
    feed['icr4'] = '           '
    feed['icr5'] = '           '
    feed['icr6'] = '           '
    feed['icr7'] = '           '
    feed['icr8'] = '           '
    feed['icr9'] = '           '


    feed['ics1'] = lang[data.lang]['MISSING']
    feed['ics2'] = lang[data.lang]['MISSING']
    feed['ics3'] = lang[data.lang]['MISSING']
    feed['ics4'] = lang[data.lang]['MISSING']
    feed['ics5'] = lang[data.lang]['MISSING']
    feed['ics6'] = lang[data.lang]['MISSING']
    feed['ics7'] = lang[data.lang]['MISSING']
    feed['ics8'] = lang[data.lang]['MISSING']
    feed['ics9'] = lang[data.lang]['MISSING']

    var interpretationCodeList = [feed['r11'], feed['r12'], feed['r13'], feed['r14'], feed['r21'], feed['r22'], feed['r33'], feed['ht1'], feed['ht2'], feed['ht3'], feed['ht4'], feed['ht5']]

    interpretationCodeList.forEach((code) => {
      feed['icq' + code] = feed['icq' + code] + 1
    })


    function integer_to_roman(num) {
      if (typeof num !== 'number')
        return false;

      var digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
          "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
          "", "       I   ", "       II ", "       III", "       IV ", "       V  ", "       VI ", "       VII", "       VIII", "       IX"
        ],
        roman_num = "",
        i = 3;
      while (i--)
        roman_num = (key[+digits.pop() + (i * 10)] || "") + roman_num;
      return Array(+digits.join("") + 1).join("M") + roman_num;
    }

    interpretationCodeList.forEach((code) => {
      feed['icr' + code] = integer_to_roman(feed['icq' + code])
    })


    interpretationCodeList.forEach((code) => {
      if (feed['icq' + code] >= 3) {
        feed['ics' + code] = lang[data.lang]['EXCESSIVE']
      } else if (feed['icq' + code] > 0) {
        feed['ics' + code] = lang[data.lang]['OK']   
      }

    })

    // page 7
    feed['hpq1'] = 0
    feed['hpq2'] = 0
    feed['hpq3'] = 0
    feed['hpq4'] = 0
    feed['hpq5'] = 0


    feed['hpr1'] = '    '
    feed['hpr2'] = '    '
    feed['hpr3'] = '    '
    feed['hpr4'] = '    '
    feed['hpr5'] = '    '


    feed['hps1'] = lang[data.lang]['MISSING']
    feed['hps2'] = lang[data.lang]['MISSING']
    feed['hps3'] = lang[data.lang]['MISSING']
    feed['hps4'] = lang[data.lang]['MISSING']
    feed['hps5'] = lang[data.lang]['MISSING']

    var personalHealthCheckList = [feed['r21'], feed['r22'], feed['r33'], feed['r41'], feed['r42']]

    personalHealthCheckList.forEach((code) => {

      if (code == '1' || code == '6') {
        code = "1"
      } else if (code == '2' || code == '7') {
        code = '2'
      } else if (code == '3' || code == '8') {
        code = '3'
      } else if (code == '4' || code == '9') {
        code = '4'
      } else if (code == '5') {
        code = '5'
      }

      feed['hpq' + code] = feed['hpq' + code] + 1
    })


    function integer_to_roman(num) {
      if (typeof num !== 'number')
        return false;

      var digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
          "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
          "", "       I   ", "       II ", "       III", "       IV ", "       V  ", "       VI ", "       VII", "       VIII", "       IX"
        ],
        roman_num = "",
        i = 3;
      while (i--)
        roman_num = (key[+digits.pop() + (i * 10)] || "") + roman_num;
      return Array(+digits.join("") + 1).join("M") + roman_num;
    }

    var list = ['1', '2', '3', '4', '5']

    list.forEach((code) => {
      var roman = integer_to_roman(feed['hpq' + code]);
      feed['hpr' + code] = roman==''?'           ':roman
    })


    list.forEach((code) => {
      if (feed['hpq' + code] >= 3) {
        feed['hps' + code] = lang[data.lang]['EXCESSIVE']
      } else if (feed['hpq' + code] > 0) {
        feed['hps' + code] =lang[data.lang]['OK']
      }

    });

    // potential heart bypass
    if (feed['r12'] == '1' || feed['r12'] == '2' || feed['r12'] == '3' || feed['r12'] == '4' || feed['r12'] == '5' || feed['r12'] == '6') {
      feed['pothb'] = lang[data.lang]['Yes']
    } else {
      feed['pothb'] = lang[data.lang]['No']
    }





















    // potential Heart Attack

    var codelist = [feed['r33'], feed['r11'] + feed['r12'], feed['r13'] + feed['r14'], feed['r21'] + feed['r22'], feed['r31'] + feed['r32'], feed['r34'] + feed['r35'], feed['r41'] + feed['r42'], feed['r14'] + feed['r22'], feed['r22'], feed['r22'] + feed['r33'], feed['r33'] + feed['r41'], feed['r11'] + feed['r21'], feed['r21'], feed['r21'] + feed['r33'], feed['r33'] + feed['r42'], feed['r13'] + feed['r22'], feed['r22'] + feed['r34'], feed['r22'] + feed['r35'], feed['r34'] + feed['r42'], feed['r35'] + feed['r42'], feed['r42'] + feed['r51'], feed['r12'] + feed['r21'], feed['r21'] + feed['r32'], feed['r21'] + feed['r31'], feed['r32'] + feed['r41'], feed['r31'] + feed['r41'], feed['r41'] + feed['r51'], feed['r32'] + feed['r33'], feed['r33'] + feed['r34'], feed['r14'] + feed['r21'], feed['r22'] + feed['r31'], feed['r35'] + feed['r41'], feed['r11'] + feed['r13'], feed['r11'] + feed['r14'], feed['r12'] + feed['s'], feed['s'] + feed['r13'], feed['r11'] + feed['r33'], feed['r11'] + feed['r22'], feed['r12'] + feed['r22'], feed['r12'] + feed['r33'], feed['r13'] + feed['r21'], feed['r13'] + feed['r33'], feed['r14'] + feed['r33'], feed['r51'] + feed['r61'], feed['r51'] + feed['r62'], feed['r61'] + feed['r71'], feed['r62'] + feed['r71'], feed['r33'] + feed['r51'], feed['r51'] + feed['r71']]
console.log(codelist);
    if (codelist.indexOf('33') !== -1 || codelist.indexOf('35') !== -1 || codelist.indexOf('53') !== -1 || codelist.indexOf('38') !== -1 || codelist.indexOf('83') !== -1) {

      feed['potha'] = lang[data.lang]['Yes']

    } else {
      feed['potha'] = lang[data.lang]['No']
    }


    // potential cancer

    potentialCancerList = [
      [feed['r11'], feed['r12'], feed['r21']],
      [feed['r11'], feed['r12'], feed['r13']],
      [feed['r12'], feed['r13'], feed['r14']],
      [feed['r21'], feed['r13'], feed['r14']],
      [feed['r13'], feed['r14'], feed['r22']]
    ]



    var pc = potentialCancerList.some((list) => {

      function validRange(x, y, z) {
        console.log('pc: ', x[0], x[1], x[2]);
        if ((+x[0] >= y && +x[0] <= z) && (+x[1] >= y && +x[1] <= z) && (+x[2] >= y && +x[2] <= z)) {
          return true;
        } else {
          return false;
        }

      }

      return validRange(list, 1, 6)
    })

    if (pc === true || (feed['r33'] === feed['r21'] && feed['r33'] === feed['r41']) || (feed['r33'] === feed['r22'] && feed['r33'] === feed['r42'])) {
      feed['potc'] = lang[data.lang]['Yes']
    } else {
      feed['potc'] = lang[data.lang]['No']
    }



    // potential hereditary diseases

    if (feed['hpq4'] == 5 || (feed['hpq1'] == 1 && feed['hpq2'] == 1 && feed['hpq3'] == 1 && feed['hpq4'] == 1 && feed['hpq5'] == 1)) {
      feed['pothd'] = lang[data.lang]['Yes']
    } else {
      feed['pothd'] = lang[data.lang]['No']
    }

    // potential prostate
    var potentialProstateIssueList = [feed['r31'], feed['r32'], feed['r33'], feed['r34'], feed['r35']]

    if (potentialProstateIssueList.indexOf('1') !== -1 || potentialProstateIssueList.indexOf('5') !== -1 || potentialProstateIssueList.indexOf('6') !== -1 || potentialProstateIssueList.indexOf('7') !== -1) {
      feed['potp'] = lang[data.lang]['Yes']
    } else {
      feed['potp'] = lang[data.lang]['No']
    }

    // page 6 
    // Profession Choice
    if (feed['r33'] == '1' || feed['r33'] == '6') {
      element = "metal"
    } else if (feed['r33'] == '2' || feed['r33'] == '7') {
      element = 'water'
    } else if (feed['r33'] == '3' || feed['r33'] == '8') {
      element = 'fire'
    } else if (feed['r33'] == '4' || feed['r33'] == '9') {
      element = 'wood'
    } else if (feed['r33'] == '5') {
      element = 'earth'
    }

    var professionChoice = {
      "metal": ['wood', 'earth', 'metal', 'water', 'fire'],
      "water": ['fire', 'metal', 'water', 'wood', 'earth'],
      "fire": ['metal', 'wood', 'fire', 'earth', 'water'],
      "wood": ['earth', 'water', 'wood', 'fire', 'metal'],
      "earth": ['water', 'fire', 'earth', 'metal', 'wood']
    }


    var professionChoiceList = professionChoice[element]

    professionChoiceList.forEach((element, index) => {
      var num = index + 1 + ''
      feed['pc' + num] = ObjreportData['profession'][data.lang][element]
    })


    // world outlook

    // chart 1

    var day = dob.split('-').reverse();;

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse();
      var mdob = data.mdob.split('-').reverse();
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse();
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse();
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }

    var date = new Date()
    var year = date.getFullYear() + ''
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    feed['wy11'] = wo1bcal.a[2][0]
    feed['wy12'] = wo1bcal.a[2][1]
    feed['wy13'] = wo1bcal.a[3][0]
    feed['wy14'] = wo1bcal.a[3][1]
    feed['w11'] = wo1bcal.b[0]
    feed['w12'] = wo1bcal.b[1]
    feed['w13'] = wo1bcal.b[2]
    feed['w14'] = wo1bcal.b[3]
    feed['w21'] = wo1bcal.c[0]
    feed['w22'] = wo1bcal.c[1]
    feed['w31'] = wo1bcal.d[0]
    feed['w32'] = wo1bcal.d[1]
    feed['w33'] = wo1bcal.d[2]
    feed['w34'] = wo1bcal.d[3]
    feed['w35'] = wo1bcal.d[4]
    feed['w3l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['w3r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['w41'] = wo1bcal.e[0]
    feed['w42'] = wo1bcal.e[1]
    feed['w51'] = wo1bcal.f[0]
    feed['w61'] = wo1bcal.g[0]
    feed['w62'] = wo1bcal.g[1]
    feed['w71'] = wo1bcal.h[0]

    // chart 2


    var day = dob.split('-').reverse();;

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse();
      var mdob = data.mdob.split('-').reverse();
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse();
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse();
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }

    var year = date.getFullYear() + 1 + ''
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    feed['wy21'] = wo1bcal.a[2][0]
    feed['wy22'] = wo1bcal.a[2][1]
    feed['wy23'] = wo1bcal.a[3][0]
    feed['wy24'] = wo1bcal.a[3][1]
    feed['w211'] = wo1bcal.b[0]
    feed['w212'] = wo1bcal.b[1]
    feed['w213'] = wo1bcal.b[2]
    feed['w214'] = wo1bcal.b[3]
    feed['w221'] = wo1bcal.c[0]
    feed['w222'] = wo1bcal.c[1]
    feed['w231'] = wo1bcal.d[0]
    feed['w232'] = wo1bcal.d[1]
    feed['w233'] = wo1bcal.d[2]
    feed['w234'] = wo1bcal.d[3]
    feed['w235'] = wo1bcal.d[4]
    feed['w23l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['w23r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['w241'] = wo1bcal.e[0]
    feed['w242'] = wo1bcal.e[1]
    feed['w251'] = wo1bcal.f[0]
    feed['w261'] = wo1bcal.g[0]
    feed['w262'] = wo1bcal.g[1]
    feed['w271'] = wo1bcal.h[0]

    // chart 3

    var day = dob.split('-').reverse();;

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse();
      var mdob = data.mdob.split('-').reverse();
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse();
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse();
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }

    var year = date.getFullYear() + 2 + ''
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    feed['wy31'] = wo1bcal.a[2][0]
    feed['wy32'] = wo1bcal.a[2][1]
    feed['wy33'] = wo1bcal.a[3][0]
    feed['wy34'] = wo1bcal.a[3][1]
    feed['w311'] = wo1bcal.b[0]
    feed['w312'] = wo1bcal.b[1]
    feed['w313'] = wo1bcal.b[2]
    feed['w314'] = wo1bcal.b[3]
    feed['w321'] = wo1bcal.c[0]
    feed['w322'] = wo1bcal.c[1]
    feed['w331'] = wo1bcal.d[0]
    feed['w332'] = wo1bcal.d[1]
    feed['w333'] = wo1bcal.d[2]
    feed['w334'] = wo1bcal.d[3]
    feed['w335'] = wo1bcal.d[4]
    feed['w33l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['w33r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['w341'] = wo1bcal.e[0]
    feed['w342'] = wo1bcal.e[1]
    feed['w351'] = wo1bcal.f[0]
    feed['w361'] = wo1bcal.g[0]
    feed['w362'] = wo1bcal.g[1]
    feed['w371'] = wo1bcal.h[0]

    // chart 4

    var day = dob.split('-').reverse();;

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }

    var year = date.getFullYear() + 3 + ''
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    feed['wy41'] = wo1bcal.a[2][0]
    feed['wy42'] = wo1bcal.a[2][1]
    feed['wy43'] = wo1bcal.a[3][0]
    feed['wy44'] = wo1bcal.a[3][1]
    feed['w411'] = wo1bcal.b[0]
    feed['w412'] = wo1bcal.b[1]
    feed['w413'] = wo1bcal.b[2]
    feed['w414'] = wo1bcal.b[3]
    feed['w421'] = wo1bcal.c[0]
    feed['w422'] = wo1bcal.c[1]
    feed['w431'] = wo1bcal.d[0]
    feed['w432'] = wo1bcal.d[1]
    feed['w433'] = wo1bcal.d[2]
    feed['w434'] = wo1bcal.d[3]
    feed['w435'] = wo1bcal.d[4]
    feed['w43l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['w43r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['w441'] = wo1bcal.e[0]
    feed['w442'] = wo1bcal.e[1]
    feed['w451'] = wo1bcal.f[0]
    feed['w461'] = wo1bcal.g[0]
    feed['w462'] = wo1bcal.g[1]
    feed['w471'] = wo1bcal.h[0]


    // chart 5

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }
    var year = date.getFullYear() + 4 + ''
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    feed['wy51'] = wo1bcal.a[2][0]
    feed['wy52'] = wo1bcal.a[2][1]
    feed['wy53'] = wo1bcal.a[3][0]
    feed['wy54'] = wo1bcal.a[3][1]
    feed['w511'] = wo1bcal.b[0]
    feed['w512'] = wo1bcal.b[1]
    feed['w513'] = wo1bcal.b[2]
    feed['w514'] = wo1bcal.b[3]
    feed['w521'] = wo1bcal.c[0]
    feed['w522'] = wo1bcal.c[1]
    feed['w531'] = wo1bcal.d[0]
    feed['w532'] = wo1bcal.d[1]
    feed['w533'] = wo1bcal.d[2]
    feed['w534'] = wo1bcal.d[3]
    feed['w535'] = wo1bcal.d[4]
    feed['w53l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['w53r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['w541'] = wo1bcal.e[0]
    feed['w542'] = wo1bcal.e[1]
    feed['w551'] = wo1bcal.f[0]
    feed['w561'] = wo1bcal.g[0]
    feed['w562'] = wo1bcal.g[1]
    feed['w571'] = wo1bcal.h[0]


    //  chart 6

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }

    var year = date.getFullYear() + 5 + ''
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    feed['wy61'] = wo1bcal.a[2][0]
    feed['wy62'] = wo1bcal.a[2][1]
    feed['wy63'] = wo1bcal.a[3][0]
    feed['wy64'] = wo1bcal.a[3][1]
    feed['w611'] = wo1bcal.b[0]
    feed['w612'] = wo1bcal.b[1]
    feed['w613'] = wo1bcal.b[2]
    feed['w614'] = wo1bcal.b[3]
    feed['w621'] = wo1bcal.c[0]
    feed['w622'] = wo1bcal.c[1]
    feed['w631'] = wo1bcal.d[0]
    feed['w632'] = wo1bcal.d[1]
    feed['w633'] = wo1bcal.d[2]
    feed['w634'] = wo1bcal.d[3]
    feed['w635'] = wo1bcal.d[4]
    feed['w63l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['w63r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['w641'] = wo1bcal.e[0]
    feed['w642'] = wo1bcal.e[1]
    feed['w651'] = wo1bcal.f[0]
    feed['w661'] = wo1bcal.g[0]
    feed['w662'] = wo1bcal.g[1]
    feed['w671'] = wo1bcal.h[0]

    // chart 7

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }

    var year = date.getFullYear() + 6 + ''
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    feed['wy71'] = wo1bcal.a[2][0]
    feed['wy72'] = wo1bcal.a[2][1]
    feed['wy73'] = wo1bcal.a[3][0]
    feed['wy74'] = wo1bcal.a[3][1]
    feed['w711'] = wo1bcal.b[0]
    feed['w712'] = wo1bcal.b[1]
    feed['w713'] = wo1bcal.b[2]
    feed['w714'] = wo1bcal.b[3]
    feed['w721'] = wo1bcal.c[0]
    feed['w722'] = wo1bcal.c[1]
    feed['w731'] = wo1bcal.d[0]
    feed['w732'] = wo1bcal.d[1]
    feed['w733'] = wo1bcal.d[2]
    feed['w734'] = wo1bcal.d[3]
    feed['w735'] = wo1bcal.d[4]
    feed['w73l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['w73r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['w741'] = wo1bcal.e[0]
    feed['w742'] = wo1bcal.e[1]
    feed['w751'] = wo1bcal.f[0]
    feed['w761'] = wo1bcal.g[0]
    feed['w762'] = wo1bcal.g[1]
    feed['w771'] = wo1bcal.h[0]

    // chart 8

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }

    var year = date.getFullYear() + 7 + ''
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    feed['wy81'] = wo1bcal.a[2][0]
    feed['wy82'] = wo1bcal.a[2][1]
    feed['wy83'] = wo1bcal.a[3][0]
    feed['wy84'] = wo1bcal.a[3][1]
    feed['w811'] = wo1bcal.b[0]
    feed['w812'] = wo1bcal.b[1]
    feed['w813'] = wo1bcal.b[2]
    feed['w814'] = wo1bcal.b[3]
    feed['w821'] = wo1bcal.c[0]
    feed['w822'] = wo1bcal.c[1]
    feed['w831'] = wo1bcal.d[0]
    feed['w832'] = wo1bcal.d[1]
    feed['w833'] = wo1bcal.d[2]
    feed['w834'] = wo1bcal.d[3]
    feed['w835'] = wo1bcal.d[4]
    feed['w83l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['w83r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['w841'] = wo1bcal.e[0]
    feed['w842'] = wo1bcal.e[1]
    feed['w851'] = wo1bcal.f[0]
    feed['w861'] = wo1bcal.g[0]
    feed['w862'] = wo1bcal.g[1]
    feed['w871'] = wo1bcal.h[0]

    // chart 9

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }

    var year = date.getFullYear() + 8 + ''
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    feed['wy91'] = wo1bcal.a[2][0]
    feed['wy92'] = wo1bcal.a[2][1]
    feed['wy93'] = wo1bcal.a[3][0]
    feed['wy94'] = wo1bcal.a[3][1]
    feed['w911'] = wo1bcal.b[0]
    feed['w912'] = wo1bcal.b[1]
    feed['w913'] = wo1bcal.b[2]
    feed['w914'] = wo1bcal.b[3]
    feed['w921'] = wo1bcal.c[0]
    feed['w922'] = wo1bcal.c[1]
    feed['w931'] = wo1bcal.d[0]
    feed['w932'] = wo1bcal.d[1]
    feed['w933'] = wo1bcal.d[2]
    feed['w934'] = wo1bcal.d[3]
    feed['w935'] = wo1bcal.d[4]
    feed['w93l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['w93r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['w941'] = wo1bcal.e[0]
    feed['w942'] = wo1bcal.e[1]
    feed['w951'] = wo1bcal.f[0]
    feed['w961'] = wo1bcal.g[0]
    feed['w962'] = wo1bcal.g[1]
    feed['w971'] = wo1bcal.h[0]

    // monthly world's outlook

    // chart 1

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    // if (data.fdob != '' && data.mdob != '') {
    //   var fdob = data.fdob.split('-').reverse()
    //   var mdob = data.mdob.split('-').reverse()

    //   var day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2].substring(0, 2)]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[2].substring(2, 4)]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    // } else if (data.fdob != '') {
    //   var fdob = data.fdob.split('-').reverse()

    //   var day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2].substring(0, 2)]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[2].substring(2, 4)]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    // } else if (data.mdob != '') {
    //   var fdob = data.mdob.split('-').reverse()

    //   var day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    // }

    var date = new Date()
    var year = date.getFullYear() + ''
    day[1] = await helper.recursive([day[1]]) + '1'
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    // console.log(day);
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    feed['my11'] = wo1bcal.a[2][0]
    feed['my12'] = wo1bcal.a[2][1]
    feed['my13'] = wo1bcal.a[3][0]
    feed['my14'] = wo1bcal.a[3][1]
    feed['m11'] = wo1bcal.b[0]
    feed['m12'] = wo1bcal.b[1]
    feed['m13'] = wo1bcal.b[2]
    feed['m14'] = wo1bcal.b[3]
    feed['m21'] = wo1bcal.c[0]
    feed['m22'] = wo1bcal.c[1]
    feed['m31'] = wo1bcal.d[0]
    feed['m32'] = wo1bcal.d[1]
    feed['m33'] = wo1bcal.d[2]
    feed['m34'] = wo1bcal.d[3]
    feed['m35'] = wo1bcal.d[4]
    feed['m3l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['m3r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['m41'] = wo1bcal.e[0]
    feed['m42'] = wo1bcal.e[1]
    feed['m51'] = wo1bcal.f[0]
    feed['m61'] = wo1bcal.g[0]
    feed['m62'] = wo1bcal.g[1]
    feed['m71'] = wo1bcal.h[0]

    // chart 2


    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }

    var year = date.getFullYear() + ''
    day[1] = await helper.recursive([day[1]]) + '2'
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    // feed['wy21'] = wo1bcal.a[2][0]
    // feed['wy22'] = wo1bcal.a[2][1]
    // feed['wy23'] = wo1bcal.a[3][0]
    // feed['wy24'] = wo1bcal.a[3][1]
    feed['m211'] = wo1bcal.b[0]
    feed['m212'] = wo1bcal.b[1]
    feed['m213'] = wo1bcal.b[2]
    feed['m214'] = wo1bcal.b[3]
    feed['m221'] = wo1bcal.c[0]
    feed['m222'] = wo1bcal.c[1]
    feed['m231'] = wo1bcal.d[0]
    feed['m232'] = wo1bcal.d[1]
    feed['m233'] = wo1bcal.d[2]
    feed['m234'] = wo1bcal.d[3]
    feed['m235'] = wo1bcal.d[4]
    feed['m23l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['m23r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['m241'] = wo1bcal.e[0]
    feed['m242'] = wo1bcal.e[1]
    feed['m251'] = wo1bcal.f[0]
    feed['m261'] = wo1bcal.g[0]
    feed['m262'] = wo1bcal.g[1]
    feed['m271'] = wo1bcal.h[0]

    // // chart 3

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + ''
    day[1] = await helper.recursive([day[1]]) + '3'
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    // feed['wy31'] = wo1bcal.a[2][0]
    // feed['wy32'] = wo1bcal.a[2][1]
    // feed['wy33'] = wo1bcal.a[3][0]
    // feed['wy34'] = wo1bcal.a[3][1]
    feed['m311'] = wo1bcal.b[0]
    feed['m312'] = wo1bcal.b[1]
    feed['m313'] = wo1bcal.b[2]
    feed['m314'] = wo1bcal.b[3]
    feed['m321'] = wo1bcal.c[0]
    feed['m322'] = wo1bcal.c[1]
    feed['m331'] = wo1bcal.d[0]
    feed['m332'] = wo1bcal.d[1]
    feed['m333'] = wo1bcal.d[2]
    feed['m334'] = wo1bcal.d[3]
    feed['m335'] = wo1bcal.d[4]
    feed['m33l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['m33r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['m341'] = wo1bcal.e[0]
    feed['m342'] = wo1bcal.e[1]
    feed['m351'] = wo1bcal.f[0]
    feed['m361'] = wo1bcal.g[0]
    feed['m362'] = wo1bcal.g[1]
    feed['m371'] = wo1bcal.h[0]

    // // chart 4

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + ''
    day[1] = await helper.recursive([day[1]]) + '4'
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    // feed['wy31'] = wo1bcal.a[2][0]
    // feed['wy32'] = wo1bcal.a[2][1]
    // feed['wy33'] = wo1bcal.a[3][0]
    // feed['wy34'] = wo1bcal.a[3][1]
    feed['m411'] = wo1bcal.b[0]
    feed['m412'] = wo1bcal.b[1]
    feed['m413'] = wo1bcal.b[2]
    feed['m414'] = wo1bcal.b[3]
    feed['m421'] = wo1bcal.c[0]
    feed['m422'] = wo1bcal.c[1]
    feed['m431'] = wo1bcal.d[0]
    feed['m432'] = wo1bcal.d[1]
    feed['m433'] = wo1bcal.d[2]
    feed['m434'] = wo1bcal.d[3]
    feed['m435'] = wo1bcal.d[4]
    feed['m43l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['m43r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['m441'] = wo1bcal.e[0]
    feed['m442'] = wo1bcal.e[1]
    feed['m451'] = wo1bcal.f[0]
    feed['m461'] = wo1bcal.g[0]
    feed['m462'] = wo1bcal.g[1]
    feed['m471'] = wo1bcal.h[0]

    // chart 5

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + ''
    day[1] = await helper.recursive([day[1]]) + '5'
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    // feed['wy31'] = wo1bcal.a[2][0]
    // feed['wy32'] = wo1bcal.a[2][1]
    // feed['wy33'] = wo1bcal.a[3][0]
    // feed['wy34'] = wo1bcal.a[3][1]
    feed['m511'] = wo1bcal.b[0]
    feed['m512'] = wo1bcal.b[1]
    feed['m513'] = wo1bcal.b[2]
    feed['m514'] = wo1bcal.b[3]
    feed['m521'] = wo1bcal.c[0]
    feed['m522'] = wo1bcal.c[1]
    feed['m531'] = wo1bcal.d[0]
    feed['m532'] = wo1bcal.d[1]
    feed['m533'] = wo1bcal.d[2]
    feed['m534'] = wo1bcal.d[3]
    feed['m535'] = wo1bcal.d[4]
    feed['m53l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['m53r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['m541'] = wo1bcal.e[0]
    feed['m542'] = wo1bcal.e[1]
    feed['m551'] = wo1bcal.f[0]
    feed['m561'] = wo1bcal.g[0]
    feed['m562'] = wo1bcal.g[1]
    feed['m571'] = wo1bcal.h[0]


    // chart 6

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }

    var year = date.getFullYear() + ''
    day[1] = await helper.recursive([day[1]]) + '6'
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    // feed['wy31'] = wo1bcal.a[2][0]
    // feed['wy32'] = wo1bcal.a[2][1]
    // feed['wy33'] = wo1bcal.a[3][0]
    // feed['wy34'] = wo1bcal.a[3][1]
    feed['m611'] = wo1bcal.b[0]
    feed['m612'] = wo1bcal.b[1]
    feed['m613'] = wo1bcal.b[2]
    feed['m614'] = wo1bcal.b[3]
    feed['m621'] = wo1bcal.c[0]
    feed['m622'] = wo1bcal.c[1]
    feed['m631'] = wo1bcal.d[0]
    feed['m632'] = wo1bcal.d[1]
    feed['m633'] = wo1bcal.d[2]
    feed['m634'] = wo1bcal.d[3]
    feed['m635'] = wo1bcal.d[4]
    feed['m63l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['m63r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['m641'] = wo1bcal.e[0]
    feed['m642'] = wo1bcal.e[1]
    feed['m651'] = wo1bcal.f[0]
    feed['m661'] = wo1bcal.g[0]
    feed['m662'] = wo1bcal.g[1]
    feed['m671'] = wo1bcal.h[0]


    // chart 7


    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + ''
    day[1] = await helper.recursive([day[1]]) + '7'
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    // feed['wy31'] = wo1bcal.a[2][0]
    // feed['wy32'] = wo1bcal.a[2][1]
    // feed['wy33'] = wo1bcal.a[3][0]
    // feed['wy34'] = wo1bcal.a[3][1]
    feed['m711'] = wo1bcal.b[0]
    feed['m712'] = wo1bcal.b[1]
    feed['m713'] = wo1bcal.b[2]
    feed['m714'] = wo1bcal.b[3]
    feed['m721'] = wo1bcal.c[0]
    feed['m722'] = wo1bcal.c[1]
    feed['m731'] = wo1bcal.d[0]
    feed['m732'] = wo1bcal.d[1]
    feed['m733'] = wo1bcal.d[2]
    feed['m734'] = wo1bcal.d[3]
    feed['m735'] = wo1bcal.d[4]
    feed['m73l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['m73r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['m741'] = wo1bcal.e[0]
    feed['m742'] = wo1bcal.e[1]
    feed['m751'] = wo1bcal.f[0]
    feed['m761'] = wo1bcal.g[0]
    feed['m762'] = wo1bcal.g[1]
    feed['m771'] = wo1bcal.h[0]

    // chart 8

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + ''
    day[1] = await helper.recursive([day[1]]) + '8'
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    // feed['wy31'] = wo1bcal.a[2][0]
    // feed['wy32'] = wo1bcal.a[2][1]
    // feed['wy33'] = wo1bcal.a[3][0]
    // feed['wy34'] = wo1bcal.a[3][1]
    feed['m811'] = wo1bcal.b[0]
    feed['m812'] = wo1bcal.b[1]
    feed['m813'] = wo1bcal.b[2]
    feed['m814'] = wo1bcal.b[3]
    feed['m821'] = wo1bcal.c[0]
    feed['m822'] = wo1bcal.c[1]
    feed['m831'] = wo1bcal.d[0]
    feed['m832'] = wo1bcal.d[1]
    feed['m833'] = wo1bcal.d[2]
    feed['m834'] = wo1bcal.d[3]
    feed['m835'] = wo1bcal.d[4]
    feed['m83l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['m83r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['m841'] = wo1bcal.e[0]
    feed['m842'] = wo1bcal.e[1]
    feed['m851'] = wo1bcal.f[0]
    feed['m861'] = wo1bcal.g[0]
    feed['m862'] = wo1bcal.g[1]
    feed['m871'] = wo1bcal.h[0]

    // chart 9


    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + ''
    day[1] = await helper.recursive([day[1]]) + '9'
    day[2] = year.substring(0, 2)
    day[3] = year.substring(2, 4)
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')
    // feed['wy31'] = wo1bcal.a[2][0]
    // feed['wy32'] = wo1bcal.a[2][1]
    // feed['wy33'] = wo1bcal.a[3][0]
    // feed['wy34'] = wo1bcal.a[3][1]
    feed['m911'] = wo1bcal.b[0]
    feed['m912'] = wo1bcal.b[1]
    feed['m913'] = wo1bcal.b[2]
    feed['m914'] = wo1bcal.b[3]
    feed['m921'] = wo1bcal.c[0]
    feed['m922'] = wo1bcal.c[1]
    feed['m931'] = wo1bcal.d[0]
    feed['m932'] = wo1bcal.d[1]
    feed['m933'] = wo1bcal.d[2]
    feed['m934'] = wo1bcal.d[3]
    feed['m935'] = wo1bcal.d[4]
    feed['m93l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['m93r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['m941'] = wo1bcal.e[0]
    feed['m942'] = wo1bcal.e[1]
    feed['m951'] = wo1bcal.f[0]
    feed['m961'] = wo1bcal.g[0]
    feed['m962'] = wo1bcal.g[1]
    feed['m971'] = wo1bcal.h[0]


    // personal outlook
    // chart 1


    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + ''
    feed['py11'] = year.split('')[0]
    feed['py12'] = year.split('')[1]
    feed['py13'] = year.split('')[2]
    feed['py14'] = year.split('')[3]
    // // console.log(year);
    console.log(day[2], day[3]);
    day[2] = +await helper.recursive([day[2]]) + +await helper.recursive([year.substring(0, 2)]) + ''
    day[3] = +await helper.recursive([day[3]]) + +await helper.recursive([year.substring(2, 4)]) + ''

    console.log(day[2], day[3]);
    // // console.log(day);
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')

    feed['p111'] = wo1bcal.b[0]
    feed['p112'] = wo1bcal.b[1]
    feed['p113'] = wo1bcal.b[2]
    feed['p114'] = wo1bcal.b[3]
    feed['p121'] = wo1bcal.c[0]
    feed['p122'] = wo1bcal.c[1]
    feed['p131'] = wo1bcal.d[0]
    feed['p132'] = wo1bcal.d[1]
    feed['p133'] = wo1bcal.d[2]
    feed['p134'] = wo1bcal.d[3]
    feed['p135'] = wo1bcal.d[4]
    feed['p13l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['p13r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['p141'] = wo1bcal.e[0]
    feed['p142'] = wo1bcal.e[1]
    feed['p151'] = wo1bcal.f[0]
    feed['p161'] = wo1bcal.g[0]
    feed['p162'] = wo1bcal.g[1]
    feed['p171'] = wo1bcal.h[0]


    // chart 2

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + 1 + ''
    feed['py21'] = year.split('')[0]
    feed['py22'] = year.split('')[1]
    feed['py23'] = year.split('')[2]
    feed['py24'] = year.split('')[3]
    // console.log(year);
    day[2] = await helper.recursive([day[2]]) + await helper.recursive([year.substring(0, 2)])
    day[3] = await helper.recursive([day[3]]) + await helper.recursive([year.substring(2, 4)])
    // console.log(day);
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')

    feed['p211'] = wo1bcal.b[0]
    feed['p212'] = wo1bcal.b[1]
    feed['p213'] = wo1bcal.b[2]
    feed['p214'] = wo1bcal.b[3]
    feed['p221'] = wo1bcal.c[0]
    feed['p222'] = wo1bcal.c[1]
    feed['p231'] = wo1bcal.d[0]
    feed['p232'] = wo1bcal.d[1]
    feed['p233'] = wo1bcal.d[2]
    feed['p234'] = wo1bcal.d[3]
    feed['p235'] = wo1bcal.d[4]
    feed['p23l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['p23r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['p241'] = wo1bcal.e[0]
    feed['p242'] = wo1bcal.e[1]
    feed['p251'] = wo1bcal.f[0]
    feed['p261'] = wo1bcal.g[0]
    feed['p262'] = wo1bcal.g[1]
    feed['p271'] = wo1bcal.h[0]



    // chart 3

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + 2 + ''
    feed['py31'] = year.split('')[0]
    feed['py32'] = year.split('')[1]
    feed['py33'] = year.split('')[2]
    feed['py34'] = year.split('')[3]
    // // console.log(year);
    day[2] = await helper.recursive([day[2]]) + await helper.recursive([year.substring(0, 2)])
    day[3] = await helper.recursive([day[3]]) + await helper.recursive([year.substring(2, 4)])
    // console.log(day);
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')

    feed['p311'] = wo1bcal.b[0]
    feed['p312'] = wo1bcal.b[1]
    feed['p313'] = wo1bcal.b[2]
    feed['p314'] = wo1bcal.b[3]
    feed['p321'] = wo1bcal.c[0]
    feed['p322'] = wo1bcal.c[1]
    feed['p331'] = wo1bcal.d[0]
    feed['p332'] = wo1bcal.d[1]
    feed['p333'] = wo1bcal.d[2]
    feed['p334'] = wo1bcal.d[3]
    feed['p335'] = wo1bcal.d[4]
    feed['p33l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['p33r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['p341'] = wo1bcal.e[0]
    feed['p342'] = wo1bcal.e[1]
    feed['p351'] = wo1bcal.f[0]
    feed['p361'] = wo1bcal.g[0]
    feed['p362'] = wo1bcal.g[1]
    feed['p371'] = wo1bcal.h[0]

    // chart 4

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + 3 + ''
    feed['py41'] = year.split('')[0]
    feed['py42'] = year.split('')[1]
    feed['py43'] = year.split('')[2]
    feed['py44'] = year.split('')[3]
    // console.log(year);
    day[2] = await helper.recursive([day[2]]) + await helper.recursive([year.substring(0, 2)])
    day[3] = await helper.recursive([day[3]]) + await helper.recursive([year.substring(2, 4)])
    // console.log(day);
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')

    feed['p411'] = wo1bcal.b[0]
    feed['p412'] = wo1bcal.b[1]
    feed['p413'] = wo1bcal.b[2]
    feed['p414'] = wo1bcal.b[3]
    feed['p421'] = wo1bcal.c[0]
    feed['p422'] = wo1bcal.c[1]
    feed['p431'] = wo1bcal.d[0]
    feed['p432'] = wo1bcal.d[1]
    feed['p433'] = wo1bcal.d[2]
    feed['p434'] = wo1bcal.d[3]
    feed['p435'] = wo1bcal.d[4]
    feed['p43l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['p43r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['p441'] = wo1bcal.e[0]
    feed['p442'] = wo1bcal.e[1]
    feed['p451'] = wo1bcal.f[0]
    feed['p461'] = wo1bcal.g[0]
    feed['p462'] = wo1bcal.g[1]
    feed['p471'] = wo1bcal.h[0]


    // chart 5

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + 4 + ''
    feed['py51'] = year.split('')[0]
    feed['py52'] = year.split('')[1]
    feed['py53'] = year.split('')[2]
    feed['py54'] = year.split('')[3]
    // console.log(year);
    day[2] = await helper.recursive([day[2]]) + await helper.recursive([year.substring(0, 2)])
    day[3] = await helper.recursive([day[3]]) + await helper.recursive([year.substring(2, 4)])
    // console.log(day);
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')

    feed['p511'] = wo1bcal.b[0]
    feed['p512'] = wo1bcal.b[1]
    feed['p513'] = wo1bcal.b[2]
    feed['p514'] = wo1bcal.b[3]
    feed['p521'] = wo1bcal.c[0]
    feed['p522'] = wo1bcal.c[1]
    feed['p531'] = wo1bcal.d[0]
    feed['p532'] = wo1bcal.d[1]
    feed['p533'] = wo1bcal.d[2]
    feed['p534'] = wo1bcal.d[3]
    feed['p535'] = wo1bcal.d[4]
    feed['p53l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['p53r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['p541'] = wo1bcal.e[0]
    feed['p542'] = wo1bcal.e[1]
    feed['p551'] = wo1bcal.f[0]
    feed['p561'] = wo1bcal.g[0]
    feed['p562'] = wo1bcal.g[1]
    feed['p571'] = wo1bcal.h[0]

    // chart 6

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + 5 + ''
    feed['py61'] = year.split('')[0]
    feed['py62'] = year.split('')[1]
    feed['py63'] = year.split('')[2]
    feed['py64'] = year.split('')[3]
    // console.log(year);
    day[2] = await helper.recursive([day[2]]) + await helper.recursive([year.substring(0, 2)])
    day[3] = await helper.recursive([day[3]]) + await helper.recursive([year.substring(2, 4)])
    // console.log(day);
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')

    feed['p611'] = wo1bcal.b[0]
    feed['p612'] = wo1bcal.b[1]
    feed['p613'] = wo1bcal.b[2]
    feed['p614'] = wo1bcal.b[3]
    feed['p621'] = wo1bcal.c[0]
    feed['p622'] = wo1bcal.c[1]
    feed['p631'] = wo1bcal.d[0]
    feed['p632'] = wo1bcal.d[1]
    feed['p633'] = wo1bcal.d[2]
    feed['p634'] = wo1bcal.d[3]
    feed['p635'] = wo1bcal.d[4]
    feed['p63l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['p63r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['p641'] = wo1bcal.e[0]
    feed['p642'] = wo1bcal.e[1]
    feed['p651'] = wo1bcal.f[0]
    feed['p661'] = wo1bcal.g[0]
    feed['p662'] = wo1bcal.g[1]
    feed['p671'] = wo1bcal.h[0]


    // chart 7

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + 6 + ''
    feed['py71'] = year.split('')[0]
    feed['py72'] = year.split('')[1]
    feed['py73'] = year.split('')[2]
    feed['py74'] = year.split('')[3]
    // console.log(year);
    day[2] = await helper.recursive([day[2]]) + await helper.recursive([year.substring(0, 2)])
    day[3] = await helper.recursive([day[3]]) + await helper.recursive([year.substring(2, 4)])
    // console.log(day);
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')

    feed['p711'] = wo1bcal.b[0]
    feed['p712'] = wo1bcal.b[1]
    feed['p713'] = wo1bcal.b[2]
    feed['p714'] = wo1bcal.b[3]
    feed['p721'] = wo1bcal.c[0]
    feed['p722'] = wo1bcal.c[1]
    feed['p731'] = wo1bcal.d[0]
    feed['p732'] = wo1bcal.d[1]
    feed['p733'] = wo1bcal.d[2]
    feed['p734'] = wo1bcal.d[3]
    feed['p735'] = wo1bcal.d[4]
    feed['p73l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['p73r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['p741'] = wo1bcal.e[0]
    feed['p742'] = wo1bcal.e[1]
    feed['p751'] = wo1bcal.f[0]
    feed['p761'] = wo1bcal.g[0]
    feed['p762'] = wo1bcal.g[1]
    feed['p771'] = wo1bcal.h[0]

    // // chart 8


    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + 7 + ''
    feed['py81'] = year.split('')[0]
    feed['py82'] = year.split('')[1]
    feed['py83'] = year.split('')[2]
    feed['py84'] = year.split('')[3]
    // console.log(year);
    day[2] = await helper.recursive([day[2]]) + await helper.recursive([year.substring(0, 2)])
    day[3] = await helper.recursive([day[3]]) + await helper.recursive([year.substring(2, 4)])
    // console.log(day);
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')

    feed['p811'] = wo1bcal.b[0]
    feed['p812'] = wo1bcal.b[1]
    feed['p813'] = wo1bcal.b[2]
    feed['p814'] = wo1bcal.b[3]
    feed['p821'] = wo1bcal.c[0]
    feed['p822'] = wo1bcal.c[1]
    feed['p831'] = wo1bcal.d[0]
    feed['p832'] = wo1bcal.d[1]
    feed['p833'] = wo1bcal.d[2]
    feed['p834'] = wo1bcal.d[3]
    feed['p835'] = wo1bcal.d[4]
    feed['p83l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['p83r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['p841'] = wo1bcal.e[0]
    feed['p842'] = wo1bcal.e[1]
    feed['p851'] = wo1bcal.f[0]
    feed['p861'] = wo1bcal.g[0]
    feed['p862'] = wo1bcal.g[1]
    feed['p871'] = wo1bcal.h[0]

    // // chart 9

    var day = dob.split('-').reverse();

    day = [day[0], day[1], day[2].substring(0, 2), day[2].substring(2, 4)];
    console.log(day);

    if (data.fdob != '' && data.mdob != '') {
      var fdob = data.fdob.split('-').reverse()
      var mdob = data.mdob.split('-').reverse()
      console.log('in 1');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];
    } else if (data.fdob != '') {
      var fdob = data.fdob.split('-').reverse()
      console.log('in 2');
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([fdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([fdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([fdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([fdob[2].substring(2, 4)]) + ''];
    } else if (data.mdob != '') {
      var mdob = data.mdob.split('-').reverse()
      console.log(day[2]);
      day = [+await helper.recursive([day[0]]) + +await helper.recursive([mdob[0]]) + '', +await helper.recursive([day[1]]) + +await helper.recursive([mdob[1]]) + '', +await helper.recursive([day[2]]) + +await helper.recursive([mdob[2].substring(0, 2)]) + '', +await helper.recursive([day[3]]) + +await helper.recursive([mdob[2].substring(2, 4)]) + ''];


    }


    var year = date.getFullYear() + 8 + ''
    feed['py91'] = year.split('')[0]
    feed['py92'] = year.split('')[1]
    feed['py93'] = year.split('')[2]
    feed['py94'] = year.split('')[3]
    // console.log(year);
    day[2] = await helper.recursive([day[2]]) + await helper.recursive([year.substring(0, 2)])
    day[3] = await helper.recursive([day[3]]) + await helper.recursive([year.substring(2, 4)])
    // console.log(day);
    var wo1bcal = await helper.numCal(day)

    // feed['d1'] = dobcal.a[0][0]
    // feed['d2'] = dobcal.a[0][1]
    // feed['mm'] = dobcal.a[1].split('').join(' ')

    feed['p911'] = wo1bcal.b[0]
    feed['p912'] = wo1bcal.b[1]
    feed['p913'] = wo1bcal.b[2]
    feed['p914'] = wo1bcal.b[3]
    feed['p921'] = wo1bcal.c[0]
    feed['p922'] = wo1bcal.c[1]
    feed['p931'] = wo1bcal.d[0]
    feed['p932'] = wo1bcal.d[1]
    feed['p933'] = wo1bcal.d[2]
    feed['p934'] = wo1bcal.d[3]
    feed['p935'] = wo1bcal.d[4]
    feed['p93l'] = await helper.recursive([wo1bcal.d[0] + wo1bcal.d[1]])
    feed['p93r'] = await helper.recursive([wo1bcal.d[3] + wo1bcal.d[4]])
    feed['p941'] = wo1bcal.e[0]
    feed['p942'] = wo1bcal.e[1]
    feed['p951'] = wo1bcal.f[0]
    feed['p961'] = wo1bcal.g[0]
    feed['p962'] = wo1bcal.g[1]
    feed['p971'] = wo1bcal.h[0]



    console.log(feed);
  }

  await calculator()


  // The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
  function replaceErrors(key, value) {
    if (value instanceof Error) {
      return Object.getOwnPropertyNames(value).reduce(function (error, key) {
        error[key] = value[key];
        return error;
      }, {});
    }
    return value;
  }

  function errorHandler(error) {
    console.log(JSON.stringify({
      error: error
    }, replaceErrors));

    if (error.properties && error.properties.errors instanceof Array) {
      const errorMessages = error.properties.errors.map(function (error) {
        return error.properties.explanation;
      }).join("\n");
      console.log('errorMessages', errorMessages);
      // errorMessages is a humanly readable message looking like this:
      // 'The tag beginning with "foobar" is unopened'
    }
    throw error;
  }

  // Load the docx file as binary content

  var editableFile = ''
  console.log(data.lang);
  if (feed['r33'] === '1' || feed['r33'] === '6') {
    editableFile = `./wordfiles/UCMHP-Analysis-Report-${data.lang}1.docx`
  } else if (feed['r33'] === '2' || feed['r33'] === '7') {
    editableFile = `./wordfiles/UCMHP-Analysis-Report-${data.lang}2.docx`
  } else if (feed['r33'] === '3' || feed['r33'] === '8') {
    editableFile = `./wordfiles/UCMHP-Analysis-Report-${data.lang}3.docx`
  } else if (feed['r33'] === '4' || feed['r33'] === '9') {
    editableFile = `./wordfiles/UCMHP-Analysis-Report-${data.lang}4.docx`
  } else if (feed['r33'] === '5') {
    editableFile = `./wordfiles/UCMHP-Analysis-Report-${data.lang}5.docx`
  }

  var content = fs
    .readFileSync(path.resolve(__dirname, editableFile), 'binary');

  var zip = new PizZip(content);
  var doc;
  try {
    doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });
  } catch (error) {
    // Catch compilation errors (errors caused by the compilation of the template: misplaced tags)
    errorHandler(error);
  }

  //set the templateVariables
  doc.setData(feed);

  try {
    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    doc.render()
  } catch (error) {
    // Catch rendering errors (errors relating to the rendering of the template: angularParser throws an error)
    errorHandler(error);
  }

  var buf = doc.getZip()
    .generate({
      type: 'nodebuffer'
    });

  // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
  fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf);


  const uploadTask = job.tasks.filter(task => task.name === 'upload-my-file')[0];

  const inputFile = fs.createReadStream(path.resolve(__dirname, 'output.docx'));

  await cloudConvert.tasks.upload(uploadTask, inputFile, 'output.docx');



  // Download
  job = await cloudConvert.jobs.wait(job.id); // Wait for job completion

  const exportTask = job.tasks.filter(
    task => task.operation === 'export/url' && task.status === 'finished'
  )[0];
  const file = exportTask.result.files[0];

  var date = Date();
  var dateNow = Date.now();
  var generatedFile = dateNow + file.filename

  const writeStream = fs.createWriteStream(path.resolve(__dirname, 'out/', generatedFile));

  https.get(file.url, function (response) {
    response.pipe(writeStream);
  });

  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  try {





    if (data.fdob) {
      fdob = data.fdob;
    } else fdob = ''

    if (data.mdob) {
      mdob = data.mdob;
    } else mdob = ''

    // var pdfName = path.join(__dirname,`../resources/${dateNow}.pdf`)

    let newUser = new User({
      name: data.name,
      lname: data.lname,
      email: data.email,
      dob: data.dob,
      tob: data.timeofbirth,
      gender: data.gender,
      country: data.country,
      twinsOrTriplets: data.twinsOrTriplets,
      fatherDOB: fdob,
      motherDOB: mdob,
      user: credentials.user,
      generatedAt: date,
      pdfName: generatedFile
    });

    newUser.save((err) => {
      if (err) console.log(err);

      console.log("User data saved" + credentials.user);
      db.collection('users').findOneAndUpdate({
        username: credentials.user,
        password: credentials.pass
      }, {
        $inc: {
          filesGenerated: 1
        }
      })

    })

    console.log('done---------------------------------------------------------------------------------------------------------');

  } catch (err) {
    console.log(err);

  }


  return generatedFile

}
