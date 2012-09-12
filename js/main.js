(function(doc){
    'use strict';

    var init, locationFound, locationNotFound,
        API = {
            id: 'C2Cse_31xwvbccaAIAaP',
            token: 'fjFdGyRjstwqr9iJxLwQ-g',
            baseURL: 'http://m.nok.it/?app_id={ID}&token={TOKEN}&c={LAT},{LON}&nord&nodot&t=1&h=300&w=200'
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
            url = API.baseURL.replace('{ID}', API.id).replace('{TOKEN}', API.token);

        //Get map tiles
        img.push(url.replace('{LAT}', lat).replace('{LON}', lon));
        img.push(url.replace('{LAT}', lat).replace('{LON}', lon));
        img.push(url.replace('{LAT}', lat).replace('{LON}', lon));

        img.forEach(function(image, index){
            doc.querySelector('.tile' + (index + 1)).innerHTML = '<img src="' + image + '"/>'
        });
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

