'use strict';

var fs = require('fs');

function generateReport (results) {
    var resultsByfiles = {};
    var xml = '<?xml version="1.0" encoding="utf-8"?>';
    var output = '';

    xml += '<lint>';

    results.forEach(function (result) {
        output = '\t<issue';
        if (result.severity === 'error') {
            output += ' severity="error"';
        } else {
            output += ' severity="warning"';
        }
        if (result.line) {
            output += ' line="' + result.line + '"';
        }
        if (result.column) {
            output += ' char="' + result.column + '"';
        }

        output += ' reason="' + result.linter + ': ' + result.message.replace(/"/g, '&quot;') + '"';

        if (resultsByfiles[result.fullPath] === undefined) {
            resultsByfiles[result.fullPath] = '';
        }

        resultsByfiles[result.fullPath] += output + ' />\n';
    });

    Object.keys(resultsByfiles).forEach(function (file) {

        xml += '<file name="' + file + '">';
        xml += resultsByfiles[file];
        xml += '</file>';
    });

    xml += '</lint>';

    fs.open("./reports/lesshint-report.xml", 'w+', function(err, data) {
        if (err) {
            console.log("ERROR creating report file! " + err);
        } else {
            fs.writeFile("./reports/lesshint-report.xml", xml, function(err) {
                if (err)
                    console.log("ERROR writing report file! " + err);
                fs.close(data, function() {
                    console.log('Report file successfully written');
                })
            });
        }
    });
}

module.exports = {
    name: 'reporter-xml-file',

    report: function (results) {
        generateReport(results);
    }
};
