//const API_HOST = "https://api.taskflow.scorgister.net";
const API_HOST = "http://localhost:8000";

function createXMLHttpRequest(method, url) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    return xhr;
}

function sendPost(url, body, response = function() {}) {
    var xhr = createXMLHttpRequest("POST", API_HOST + url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cookies", document.cookie);

    token = getCookie("token");

    if(token != null && token != undefined && token != "")
        xhr.setRequestHeader("X-Application-Auth", token)

    xhr.overrideMimeType('application/json; charset=utf-8');

    xhr.onreadystatechange = function() {
        result(xhr, response);
    };

    body = JSON.stringify(body);
    
    xhr.send(body);
}

function sendGet(url, response = function() {}) {
    var xhr = createXMLHttpRequest("GET", API_HOST + url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cookies", document.cookie);

    token = getCookie("token");

    if(token != null && token != undefined && token != "")
        xhr.setRequestHeader("X-Application-Auth", token)

    xhr.overrideMimeType('application/json; charset=utf-8');
    
    xhr.onreadystatechange = function() {
        result(xhr, response);
    };

    xhr.send();
}

function sendPostFormData(url, formData, response = function() {}) {
    var xhr = createXMLHttpRequest("POST", "https://api.taskflow.scorgister.net" + url);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Cookies", document.cookie);

    xhr.onreadystatechange = function() {
        result(xhr, response);
    };
    xhr.send(formData);
}

function result(xhr, response) {
    if(xhr.readyState === 4) {
        try {
            var obj = JSON.parse(xhr.response);
            try {
                if(obj != null)
                    response(true, obj);
                else
                    response(false, xhr.response);
            }catch(e) {}
        }catch(e) {
            response(false, xhr.response);
        }
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while(c.charAt(0) == ' ')
            c = c.substring(1);

        if(c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }

    return null;
}

function setCookie(name, value, days) {
    var expires = "";
    if(days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=0'
}

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

String.prototype.noaccent = function(){
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
     
    var str = this;
    for(var i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }
     
    return str;
}

String.prototype.countocc = function(characterToCount) {
    let count = 0;
  
    for(let i = 0; i < this.length; i++) {
        if(this[i] === characterToCount) {
            count++;
        }
    }
  
    return count;
}

function hash(string) {
    return digest("sha-256", string)
}