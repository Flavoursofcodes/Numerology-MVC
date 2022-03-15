exports.recursive = async function recursive(data) {
  result = [];
  data.forEach(k => {
    if(k=='00'||k=='0'){
      k='05'
    }
    var va = k.split('');
    if (va.length > 1) {
      var val = +va[0] + +va[1];
    if (val > 9) {
      var v = val.toString().split('');
      var res = +v[0] + +v[1];
      result.push(res + '');
    } else {
      result.push(val + '');
    }
    } else{
      result.push(va[0])
    }
    // console.log(result);
  });
  return await result;
}

async function recursive(data) {
  result = [];
  data.forEach(k => {
    if(k=='00'||k=='0'){
      k='05'
    }
    var va = k.split('');
    if (va.length > 1) {
      var val = +va[0] + +va[1];
    if (val > 9) {
      var v = val.toString().split('');
      var res = +v[0] + +v[1];
      result.push(res + '');
    } else {
      result.push(val + '');
    }
    } else{
      result.push(va[0])
    }
    // console.log(result);
  });
  return await result;
}


exports.numCal = async function (day) {
  // console.log(day[3]);
  if (day[3] == '00' || day[3] == '0' ) {
    day[3] == '05'
  }
  var a = day;
  var b = c = d = f = g = h = [];
  b = await recursive(a);
  c = await recursive([b[0] + b[1], b[2] + b[3]]);
  d = await recursive([b[0] + c[0], b[1] + c[0], c[0] + c[1], b[2] + c[1], b[3] + c[1]]);

  e = await recursive([c[1] + d[2], c[0] + d[2]]);
  f = await recursive([e[0] + e[1]]);
  g = await recursive([e[1] + f[0], e[0] + f[0]]);
  h = await recursive([g[0] + g[1]]);
console.log(a,b,c,d,e,f,g,h);
   return {
    a: a,
    b: b,
    c: c,
    d: d,
    e: e,
    f: f,
    g: g,
    h: h
  }

}



function repeatedSum(num) {
  if (num > 9) {
    lnum = num.toString().split('').map(x => +x)
    num = lnum[0] + lnum[1]
    return repeatedSum(num)
  } else {
    return num
  }
}

// var date = '17-04-1999'

exports.spliter = function (date) {
  numl = date.split('-').join('').split('').map(x => +x)
  return numl
}


exports.calcNumbers = function (list) {
  var a = repeatedSum(list[0] + list[1]),
    b = repeatedSum(list[2] + list[3]),
    c = repeatedSum(list[4] + list[5]),
    d = repeatedSum(list[6] + list[7]),
    e = repeatedSum(a + b),
    f = repeatedSum(c + d),
    g = repeatedSum(e + a),
    h = repeatedSum(e + b),
    i = repeatedSum(e + f),
    j = repeatedSum(f + c),
    k = repeatedSum(f + d),
    l = repeatedSum(g + h),
    m = repeatedSum(j + k),
    n = repeatedSum(l + m),
    o = repeatedSum(n + m),
    p = repeatedSum(n + l),
    q = repeatedSum(o + p)

  return finalList = [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q]

}


// console.log(finalList);

// export {spliter,finalList}

//   a---b---c---d
//    \ /     \ /
//     e       f
//      \     /
//       \   / 
// g   h   i   j   k
//  \ /         \ /
//   l           m 
//    \         /
//     \       /
//      \     /
//       \   / 
//         n  
//        / \ 
//       o   p 
//        \ /
//         q