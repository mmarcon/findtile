(function(doc){
    'use strict';

    Array.prototype.randomElement = Array.prototype.randomElement || function(){
        return this[Math.floor(Math.random()*this.length)];
    };

    var init, locationFound, locationNotFound, cities,
        API = {
            id: 'C2Cse_31xwvbccaAIAaP',
            token: 'fjFdGyRjstwqr9iJxLwQ-g',
            baseURL: 'http://m.nok.it/?app_id={ID}&token={TOKEN}&c={LAT},{LON}&nord&nodot&t=1&h=200&w=200'
        };

    init = function(){
        //app lives here
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(locationFound, locationNotFound);
        }
        else {
            locationNotFound();
        }
    };

    locationFound = function(position){
        var lat = position.coords.latitude,
            lon = position.coords.longitude,
            img = [],
            url = API.baseURL.replace('{ID}', API.id).replace('{TOKEN}', API.token),
            req;

        //Get map tiles
        img.push(url.replace('{LAT}', lat).replace('{LON}', lon));

        req = new XMLHttpRequest();
        req.open('GET', 'data/cities.json', true);
        req.onreadystatechange = function (aEvt) {
            var city, el;
            if (req.readyState == 4) {
                if(req.status == 200) {
                    cities = JSON.parse(req.responseText);
                    city = cities.randomElement();
                    console.log(city);
                    img.push(url.replace('{LAT}', city.lat).replace('{LON}', city.lon));
                    city = cities.randomElement();
                    console.log(city);
                    img.push(url.replace('{LAT}', city.lat).replace('{LON}', city.lon));
                    img.forEach(function(image, index){
                        el = doc.createElement('img');
                        el.src = image;
                        el.onload = function(){
                            this.parentNode.style.display = 'inline-block';
                        };
                        doc.querySelector('.tile' + (index + 1)).appendChild(el);
                    });
                    // Array.prototype.forEach.call(doc.querySelectorAll('ol li'), function(e){
                    //     e.style.display = 'inline-block';
                    // });
                }
                else {
                    doc.querySelector('.error.nodata').style.display = 'block';
                }
            }
        };
        req.send(null);
    };

    locationNotFound = function(){
        doc.querySelector('.error.nolocation').style.display = 'block';
    };

    if(doc.addEventListener) {
        doc.addEventListener('DOMContentLoaded', init, false);
    }
    else {
        window.onload = init;
    }
})(document);

