var saRequest = require('superagent');
var path = require('path');
var filesDir = path.resolve(__dirname + '../../files');
var jsdom = require('jsdom');


module.exports.create = function (host, offset) {
    return new Loader(host, offset);
};
var Loader = function (host, offset, interval) {
    this.host = host;
    this.offset = offset;
    this.interval = interval;
};

Loader.prototype.load = function (group, itr) {
    this.partialLoad(group.name, path.resolve(filesDir + '/' + group.dirPath), group.url, function (err, res) {
        var t = 1;
    });
};

Loader.prototype.partialLoad = function (groupName, groupDirPath, groupUrl, callback) {
    var self = this;
    async.waterfall([
        // получение контента
        function (callback) {
            self.getAlWall(groupUrl, groupDirPath, callback);
        },
        // вытаскиваем ссылки на картинки и подпись к ним.
        function (htmlPage, callback) {
            var t = 1;
        },
        // загрузка всех картинок в соответствующую папку
        function (callback) {

        }
    ], function (err) {
        callback(err);
    });
};

Loader.prototype.getAlWall = function (url, dirPath, callback) {
    saRequest
        .post('http://' + this.host + "/al_wall.php")//"http://localhost:1389/loader/test?groupName=test")
        .type('form')
        .set('Host', this.host)
        .set('Origin', 'http://' + this.host)
        .set('User-Agent', 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0)')
        .set('Content-Length', 68)

        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', '*/*')

        .set('DNT', 1)
        .set('Referer', "http://" + this.host + "/" + url)
        .set('Accept-Encoding', 'gzip,deflate')

        .set('Accept-Language', 'ru-RU')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Cookie', 'remixlang=0; remixstid=1608504310_f4cd614198e7869425; remixrefkey=43ca8dc578d9c16df7; remixdt=0; JSID32=D26FF520715F30B8EB112626A6679D82; modeNotice=1; remixflash=13.0.0; remixscreen_depth=32; amcu_n=1')
        .send({
            act: "get_wall",
            al: 1,
            fixed: 41864734,
            offset: this.offset,
            owner_id: -10639516,
            type: "own"
        })
        .on('error', function (err) {
            return callback(err);
        })
        .end(function (res) {
            if (!res.ok) {
                var err = res;
            } else {
                getImageUrls(dirPath, res.text);
            }
        });
};

var getImageUrls = module.exports.getImageUrls = function (dirPath, html) {
    var urls = [];
    /*var ppqw = $(html).find('page_post_queue_wide');
     var t = $(ppqw).each(function (){
     var imgs = $(this).find('page_post_thumb_sized_photo');
     var imgurl = $(imgs[0]).attr('href');
     });*/
    jsdom.env({
        html: "<html><body>" + html + "</body></html>",
        scripts: [
            'http://code.jquery.com/jquery-1.5.min.js'
        ],
        done: function (err, window) {
            var $ = window.jQuery;

            $.each($(".page_post_queue_wide"), function () {
                var t = $(this).find("img");
                urls.push($(this).find("img").attr("src"));
            }).addClass('test');


            console.log(urls);
            console.log(dirPath);
            var http = require('http')
                , fs = require('fs');
            var i = 0;
            async.eachLimit(urls, 1, function (url, done) {
                    console.log(dirPath);
                    var request = http.get(url, function (res) {
                        var imagedata = '';
                        res.setEncoding('binary');

                        res.on('data', function (chunk) {
                            imagedata += chunk
                        });

                        res.on('end', function () {
                            console.log(dirPath);
                            var pth = path.resolve(dirPath + "/" + i + '.png');
                            fs.writeFile(pth, imagedata, 'binary', function (err) {
                                i++;
                                if (err) {
                                    return done(err);
                                }
                                return done();
                            })
                        })
                    })
                },
                function (err) {

                });


        }
    });
};