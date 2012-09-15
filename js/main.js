/*
 * Copyright 2012 Massimiliano Marcon (http://marcon.me)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
(function(doc){
    'use strict';

    Array.prototype.randomElement = Array.prototype.randomElement || function(){
        return this[Math.floor(Math.random()*this.length)];
    };
    Array.prototype.shuffle = Array.prototype.shuffle || function(){
        for(var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    };

    var init, locationFound, locationNotFound, cities, attachEventHandlers, warnOnReload = false,
        API = {
            id: 'C2Cse_31xwvbccaAIAaP',
            token: 'fjFdGyRjstwqr9iJxLwQ-g',
            baseURL: 'http://m.nok.it/?app_id={ID}&token={TOKEN}&c={LAT},{LON}&nord&nodot&t=1&h=200&w=200&z={ZOOM}'
        },
        overlay = doc.querySelector('.overlay'),
        answers = {},
        text = {
            correct: 'Well done, that is indeed your location!',
            wrong: 'Nope! Unfortunately you picked the wrong one. ' +
                   'That one is ${CITY}, and you can learn more about it ' +
                   '<a href="http://en.wikipedia.com/wiki/${W_CITY}" target="_blank">on Wikipedia</a>.'
        };

    init = function(){
        //app lives here
        attachEventHandlers();
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
            req, zoom = Math.max(9, Math.floor(Math.random() * 14));

        //Get map tiles
        img.push(url.replace('{LAT}', lat).replace('{LON}', lon).replace('{ZOOM}', zoom));

        req = new XMLHttpRequest();
        req.open('GET', 'data/cities.json', true);
        req.onreadystatechange = function (aEvt) {
            var city, rurl, el;
            if (req.readyState == 4) {
                if(req.status == 200) {
                    cities = JSON.parse(req.responseText);
                    cities.shuffle();
                    city = cities.randomElement();
                    //console.log(city);
                    rurl = url.replace('{LAT}', city.lat).replace('{LON}', city.lon).replace('{ZOOM}', zoom);
                    img.push(rurl);
                    answers[rurl] = city;
                    cities.shuffle();
                    city = cities.randomElement();
                    //console.log(city);
                    rurl = url.replace('{LAT}', city.lat).replace('{LON}', city.lon).replace('{ZOOM}', zoom);
                    img.push(rurl);
                    answers[rurl] = city;

                    answers.correct = img[0];
                    img.shuffle();
                    img.forEach(function(image, index){
                        el = doc.createElement('img');
                        el.width = 200;
                        el.height = 200;
                        el.src = image;
                        el.onload = function(){
                            this.style.display = 'block';
                            this.parentNode.classList.add('back');
                        };
                        doc.querySelector('.tile' + (index + 1)).appendChild(el);
                    });

                    if (warnOnReload) {
                        if (localStorage.getItem('findtile')) {
                            overlay.style.display = 'block';
                            doc.querySelector('.error.cheating').style.display = 'block';
                        }
                        else {
                            //for cheaters
                            localStorage.setItem('findtile', true);
                        }
                    }
                }
                else {
                    overlay.style.display = 'block';
                    doc.querySelector('.error.nodata').style.display = 'block';
                }
            }
        };
        req.send(null);
    };

    locationNotFound = function(){
        overlay.style.display = 'block';
        doc.querySelector('.error.nolocation').style.display = 'block';
    };

    attachEventHandlers = function(){
        [].forEach.call(doc.querySelectorAll('.error span'), function(e){
            e.addEventListener('click', function(){
                this.parentNode.style.display = 'none';
                overlay.style.display = 'none';
            }, false);
        });
        [].forEach.call(doc.querySelectorAll('ol li'), function(li){
            li.addEventListener('click', function(e) {
                var src = this.querySelector('img').src,
                    result = document.querySelector('.result');
                [].forEach.call(this.parentNode.children, function(l){
                    l.classList.remove('correct');
                    l.classList.remove('wrong');
                });
                if (src === answers.correct) {
                    this.classList.add('correct');
                    result.classList.remove('wrong');
                    result.classList.add('correct');
                    result.innerHTML = text.correct;
                }
                else {
                    this.classList.add('wrong');
                    result.classList.remove('correct');
                    result.classList.add('wrong');
                    result.innerHTML = text.wrong.replace('${CITY}', decodeURIComponent(answers[src].city))
                                               .replace('${W_CITY}', answers[src].wikipedia);
                }
            });
        });
    };

    if(doc.addEventListener) {
        doc.addEventListener('DOMContentLoaded', init, false);
    }
    else {
        window.onload = init;
    }
})(document);

