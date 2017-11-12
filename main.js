  /*类操作*/
  var classUntil = (function() {
      function hasClass(_object, _clsname) {
          var _clsname = _clsname.replace(".", "");
          var _sCls = " " + (_object.className) + " ";
          return (_sCls.indexOf(" " + _clsname + " ") != -1) ? true : false;
      }

      function toClass(_str) {
          var _str = _str.toString();
          _str = _str.replace(/(^\s*)|(\s*$)/g, "");
          _str = _str.replace(/\s{2,}/g, " ");
          return _str;
      }

      function addClass(_object, _clsname) {
          var _clsname = _clsname.replace(".", "");
          if (!hasClass(_object, _clsname)) {
              _object.className = toClass(_object.className + (" " + _clsname));
          }
      }

      function delClass(_object, _clsname) {
          var _clsname = _clsname.replace(".", "");
          if (hasClass(_object, _clsname)) {
              _object.className = toClass(_object.className.replace(new RegExp("(?:^|\\s)" + _clsname + "(?=\\s|$)", "g"), " "));
          }
      }
      return {
          hasClass: hasClass,
          toClass: toClass,
          addClass: addClass,
          delClass: delClass
      }
  })();
function each(_objects, _fn) {
    for (var i = 0, len = _objects.length; i < len; i++) {
        _fn(_objects[i], i);
    }
}
  /*事件注册*/
function addEvent(el, name, fn) {
    if (el.attachEvent) return el.attachEvent('on' + name, fn);
    return el.addEventListener(name, fn, false);
}


/*cookie*/
var cookieUntil = {
    get: function(name) {
        var cookieName = encodeURIComponent(name) + '=',
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue;
        if (cookieStart > -1) {
            var cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));

        }

        return cookieValue;
    },

    set: function(name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        if (expires instanceof Date) {
            cookieText += ";expires=" + expires.toGMTString();

        }
        if (path) {
            cookieText += ";path=" + path;
        }
        if (domain) {
            cookieText += ";domain=" + domain;
        }
        if (secure) {
            cookieText += ";secure=" + secure;
        }
        document.cookie = cookieText;
    },
    unset: function(name, path, domain, secure) {
        this.set(name, "", new Date(0), path, domain, secure);
    }
};
function time() {
    var date = new Date();
    date.setDate(date.getDate() + 10);
    return date;
}
    /*AJAX*/
function ajaxUntil(item) {
    item = item || {};
    item.method = item.method || 'get';
    item.url = item.url || '';
    item.async = item.async || true;
    item.data = item.data || null;
    item.success = item.success || function() {};
    item.fail = item.fail || function() {};

    var xmlhttp;
    if (window.XMLHttpRequest) {
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp = new XMLHttpRequest();
    } else {
        // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    var params = [];
    for (var key in item.data) {
        params.push(key + '=' + item.data[key]);
    }

    var postData = params.join('&');
    if (item.method.toUpperCase() === 'POST') {
        xmlHttp.open(item.method, item.url, item.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    } else if (item.method.toUpperCase() === 'GET') {
        xmlhttp.open(item.method, item.url + '?' + postData, item.async);
        xmlhttp.send(null);
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            item.success(xmlhttp.responseText);

        } else {
            item.fail(xmlhttp.status);
        }
    }

}


   
   
  /*轮播图*/
(function() {
    var slide = document.getElementsByTagName('ol');
    var _lists = slide[0].children;
    var pointer = document.getElementsByClassName('u-pointer');
    var _ctrls = pointer[0].children;
    var j = 0;
    var len = _lists.length;
    var timer;

    function play() {
        timer = setInterval(function() {
            for (let i = 0; i < len; i++) {
                classUntil.delClass(_lists[i], "z-crt");
                classUntil.delClass(_ctrls[i], "z-crt");
            }
            classUntil.addClass(_lists[j], "z-crt");
            classUntil.addClass(_ctrls[j], "z-crt");
            j++;
            j = j == len ? 0 : j;
        }, 5000);
    }
    play();

    addEvent(slide[0], 'mouseenter', function() {
        clearInterval(timer);
    });
    addEvent(slide[0], 'mouseleave', function() {
        play();
    });
    addEvent(pointer[0], 'click', function() {


        each(_ctrls, function(_ctrl, i) {
            _ctrl.onclick = function() {
                each(_lists, function(_list, i) {
                    classUntil.delClass(_list, "z-crt");
                });
                each(_ctrls, function(_ctrl, i) {
                    classUntil.delClass(_ctrl, "z-crt");
                });
                classUntil.addClass(_lists[i], "z-crt");

                classUntil.addClass(_ctrls[i], "z-crt");
            }
        });
    });

})();

/*视频弹窗*/
var _media = document.getElementsByClassName('media');
var _video = _media[0].children[3];
var _videobox = document.getElementsByClassName('videobox');
addEvent(_video, 'click', function() {
    _videobox[0].style.display = "block";
})
/*close*/
var _closes = document.getElementsByClassName('u-close');
each(_closes, function(_close, i) {
    _close.onclick = function() {
        this.parentNode.parentNode.style.display = "none";
        /*顶部cookie*/
        var closeIndexOf = i;
        closeIndexOf == 2 && cookieUntil.set('toptip', 'no', time());
    }
});
 /*关闭通知条*/
if (cookieUntil.get('toptip') !== undefined) {
    document.getElementsByClassName('g-tipbox')[0].style.display = "none";
}

/*关注/登录*/

(function() {
    /*关注*/
    var _followButton = document.getElementsByClassName('u-btn');
    var _follows = _followButton[0].children;
    addEvent(_follows[0], 'click', function() {
        /*已登录*/

        if (cookieUntil.get('loginSuc') !== undefined) {
            /*请求*/
            ajaxUntil({
                method: 'get',
                url: 'http://study.163.com/webDev/attention.htm',
                success: function(response) {
                    if (response = "1") {
                        _follows[0].style.display = 'none';
                        _follows[1].style.display = 'block';

                    }
                }
            });
            cookieUntil.set('followSuc', 'yes', time());

        }
        /*未登录*/
        else {
            document.getElementsByClassName('loginbox')[0].style.display = "block";
        }
    });
    /*取消关注*/
    addEvent(_follows[1].lastChild, 'click', function() {
        cookieUntil.unset('followSuc');
        _follows[1].style.display = 'none';
        _follows[0].style.display = 'block';

    });
    var _loginbox = document.getElementsByClassName('loginbox')[0];
    var _login = _loginbox.children[1];
    var _loginlst = _login.children;
    addEvent(_loginlst[5], 'click', function() {

        var userName = _loginlst[2].value;
        var passWord = _loginlst[3].value;
        var message = _loginlst[4];
        if (userName == '' || passWord == '') {
            message.innerText = '请输入用户名/密码';
        } else {
            userName = md5(userName);
            passWord = md5(passWord);

            ajaxUntil({
                method: 'get',
                url: 'http://study.163.com/webDev/login.htm',
                data: {
                    userName: userName,
                    password: passWord
                },
                success: function(response) {
                    if (response == 1) {
                        message.innerText = '登录成功';
                        cookieUntil.set('loginSuc', 'yes', time());
                        setTimeout(function() {
                            _closes[1].parentNode.parentNode.style.display = "none";
                            _follows[0].click();
                        }, 2000);
                    } else {
                        message.innerText = '用户名/密码错误';
                    }
                }

            })
        }
    })
})();
/*课程数据获取与页面渲染*/
(function() {
    
    var _tablst = document.getElementsByClassName('u-tab');
    var _tabs = _tablst[0].children;
    var curLists = document.getElementsByClassName('m-course');
    var pagePointer = document.getElementsByClassName('m-page');
    var _pageprv = pagePointer[0].firstChild;
    var _pagenxt = pagePointer[0].lastChild;
    var _pagelst = pagePointer[0].children;
    var curPage=0;

    function getPage(pageNo, type, psize) {
        ajaxUntil({
            method: 'get',
            url: 'http://study.163.com/webDev/couresByCategory.htm',
            data: {
                pageNo: pageNo,
                psize: psize,
                type: type
            },
            success: function(data) {
                var response = JSON.parse(data);
                curPage = pageNo;

                var curList = type === 10 ? curLists[0] : curLists[1];
                pagePointer[0].innerHTML = '<li class="pageprv"></li>';
                curList.innerHTML = '';
                var responseList = response.list;
                var totalPage = response.totalPage;
                /*翻页器渲染*/
                for (let i = 1; i <= totalPage; i++) {
                    pagePointer[0].innerHTML += '<a>' + i + '</a>';
                }
                pagePointer[0].innerHTML += '<li class="pagenxt"></li>';

               classUntil.addClass(pagePointer[0].children[curPage], 'z-crt');
                /*课程渲染*/
                for (let i = 0; i < responseList.length; i++) {
                    var categoryName = responseList[i].categoryName ? responseList[i].categoryName : '无',
                        price = responseList[i].price ? '￥' + responseList[i].price : '免费';
                    curList.innerHTML += '<div class="smallCard f-pr" > <img class="photo" src="' + responseList[i].middlePhotoUrl + '">' +
                        '<a class="name">' + responseList[i].name + '</a>' + '<p class="provider">' + responseList[i].provider + '</p>' +
                        '<span class="learnCounter">' + responseList[i].learnerCount + '</span><p class="price">' + price + '</p>' + '<div class="bigCard"><div class="dtbox"> <img src="' + responseList[i].middlePhotoUrl + '"><div class="detail f-fr"><a class="name">' + responseList[i].name + '</a><span class="learnCounter">' + responseList[i].learnerCount + '在学' + '</span><p class="provider">' + responseList[i].provider + '</p>' + '<p class="categoryName"> 分类：' + categoryName +
                        '</p></div></div><p class="description"> ' + responseList[i].description + '</p></div></div>'
                }
            }
        })
    };
    var count = screen.availWidth < 1205 ? 15 : 20;
    getPage(1, 10, count);
    addEvent(_tablst[0], 'click', function() {
        each(_tabs, function(_tab, i) {
                _tab.onclick = function() {
                    each(_tabs, function(_tab, i) {
                        classUntil.delClass(_tab, "z-select");
                    })
                    classUntil.addClass(_tabs[i], "z-select");
                    var curTab = i == 0 ? 10 : 20;
                    var hideIndex = _tabs.length - i - 1;
                    curLists[hideIndex].style.display = 'none';
                    curLists[i].style.display = 'block';
                    getPage(1, curTab, count);
                }

            }

        )
    });
    
    
    addEvent(pagePointer[0], 'click', function(e) {
        var curType = 0;
        e = e || window.event;
        var target = e.target || e.srcElement;
        var pageIndex=1;
        if (_tabs[0].classList == "z-select") {
            curType = 10;
        } else {
            curType = 20;
        }
        if (target.nodeName == 'A'  ) {
            if(!classUntil.hasClass(target, 'z-crt')){
                pageIndex = parseInt(target.innerText);
                getPage(pageIndex, curType, count);
            }
            console.log('one'+pageIndex); 
        }
        else{
            target.classList.value==pagePointer[0].children[0].classList.value?curPage>1&&getPage(curPage-1,curType,count):curPage<_pagelst.length-2&&getPage(curPage+1,curType,count);
            
        }
    });

})();
/*热门排行*/
(function() {
    var _hotlist = document.getElementsByClassName('scroll')[0];
    _hotlist.innerHTML = '';
    var index=-1,
        total;

    function getHotList() {
        ajaxUntil({
            method: 'get',
            url: 'http://study.163.com/webDev/hotcouresByCategory.htm',
            success: function(response) {
                response = JSON.parse(response);
                total=response.length;
                for (let i = 0; i < total; i++) {
                    _hotlist.innerHTML += '<li class="u-hot"><div class="smallph f-fl"><img class="photo" src="' + response[i].smallPhotoUrl + '"/>' + '</div><div class="hottxt f-fr">' + '<a class="name">' + response[i].name + '</a><span class="learnCounter ">' + response[i].learnerCount +
                        '</span></p></div></li>';
                }
                // _hotlist.innerHTML += '</ul><ul id=scroll1>';
                //  for (let i = 10; i < 20; i++) {
                //     _hotlist.innerHTML += '<li class="u-hot"><div class="smallph f-fl"><img class="photo" src="' + response[i].smallPhotoUrl + '"/>' + '</div><div class="hottxt f-fr">' + '<a class="name">' + response[i].name + '</a><span class="learnCounter ">' + response[i].learnerCount +
                //         '</span></p></div></li>';
                // }
                

            }
        })
    }
    getHotList();
    function shift(obj, attr, target) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function() {    
            cur = parseInt(getStyle(obj, attr));
            speed = (target - cur) / 20; 
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); 
            if (cur == target) {
                clearInterval(obj.timer);
            } else {
                obj.style[attr] = cur + speed + "px";
            }
        }, 25);
    }   
    function getStyle(obj, name) {
        if (obj.currentStyle) {
            return obj.currentStyle[name];
        } else {
            return getComputedStyle(obj, false)[name];
        }
    }
    function shift(obj, attr, target) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function() {    
            cur = parseInt(getStyle(obj, attr));
            speed = (target - cur) / 20; 
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); 
            if (cur == target) {
                clearInterval(obj.timer);
            } else {
                obj.style[attr] = cur + speed + "px";
            }
        }, 25);
    }   
    //滚动更新
    function change() {
        timer = setInterval(function() {
            index++;
            index = index > total - 10 ? 0 : index;
            var target = -(index * 70) + 56;
            shift(_hotlist, 'top', target);
        }, 5000);
    }
    addEvent(_hotlist, 'mouseenter', function() {
        clearInterval(timer);
    });
    addEvent(_hotlist, 'mouseleave', function() {
        change();
    });

    change();

})();
