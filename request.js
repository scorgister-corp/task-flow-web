const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

function createXMLHttpRequest(method, url) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    return xhr;
}

function sendPost(url, token, body, response = function() {}) {
    var xhr = createXMLHttpRequest("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("X-Application-Auth", token);
        
    xhr.onreadystatechange = function() {
        result(xhr, response);
    };

    body = JSON.stringify(body);
    
    xhr.send(body);
}

function sendGet(url, token, response = function() {}) {
    var xhr = createXMLHttpRequest("GET", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("X-Application-Auth", token);
    
    xhr.onreadystatechange = function() {
        result(xhr, response);
    };

    xhr.send();
}

function sendPostFormData(url, formData, response = function() {}) {
    var xhr = createXMLHttpRequest("POST", url);
    xhr.withCredentials = true;

    xhr.onreadystatechange = function() {
        result(xhr, response);
    };
    xhr.send(formData);
}

function result(xhr, response) {
    if(xhr.readyState === 4) {
        try {
            var obj = JSON.parse(xhr.responseText);
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

module.exports.sendGet = sendGet;
module.exports.sendPost = sendPost;
module.exports.sendPostFormData = sendPostFormData;
