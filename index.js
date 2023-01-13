const xlsx = require("xlsx")
var request = require('request');

var url = 'https://itunes.apple.com/vn/rss/customerreviews/id=1574177729/sortBy=mostRecent/json';

request.get({
    url: url,
    json: true,
    headers: { 'User-Agent': 'request' }
}, (err, res, data) => {
    if (err) {
        console.log('Error:', err);
    } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
    } else {
        var jsonString = JSON.stringify(data.feed.entry).replaceAll("im:", "")
        var json = JSON.parse(jsonString)
        var files = []
        for (each in json) {
            files.push(json[each])
        }
        var obj = files.map((e) => {
            var row = {
                'author': e.author.name.label,
                'updated': e.updated.label,
                'rating': e.rating.label,
                'version': e.version.label,
                'id': e.id.label,
                'title': e.title.label,
                'content': e.content.label
            }
            return row
        })

        var newWB = xlsx.utils.book_new()

        var newWS = xlsx.utils.json_to_sheet(obj)

        xlsx.utils.book_append_sheet(newWB, newWS, "reviews_ios_all")//workbook name as param

        xlsx.writeFile(newWB, "reviews_ios.xlsx")//file name as param
    }
});