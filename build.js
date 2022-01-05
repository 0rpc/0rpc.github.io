var fs = require("fs"),
    mustache = require("mustache"),
    _ = require("underscore"),
    wrench = require("wrench"),
    util = require("util");

var CLIENT_LANGUAGES = ["python", "node.js", "cli"];
var SERVER_LANGUAGES = ["python", "node.js"];
var EXAMPLES = ["Hello World", "Streaming Responses", "First Class Exceptions"];

var HLJS_LANGUAGE_MAP = {
    "python": "python",
    "node.js": "javascript",
    "cli": "no-highlight"
};

function getFile() {
    var args = ["."].concat(Array.prototype.slice.call(arguments));
    var path = Array.prototype.join.call(args, "/");
    return fs.readFileSync(path, "utf8");
}

function getSource(exampleId, type, language) {
    return getFile("examples", exampleId, type + "-" + language)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br/>");
}

var exampleTemplate = fs.readFileSync("./templates/example_template.html", "utf8");

var examples = _.map(EXAMPLES, function(title) {
    var exampleId = title.toLowerCase().replace(/ /ig, "-");

    var createLanguagesData = function(exampleId, type, source) {
        return _.map(source, function(language) {
            return {
                language: language,
                hljsClass: HLJS_LANGUAGE_MAP[language] || "",
                source: getSource(exampleId, type, language),
                tabId: [exampleId, type, language.replace(/\./ig, "")].join("-")
            };
        });
    };

    return mustache.render(exampleTemplate, {
        title: title,
        exampleId: exampleId,

        types: [{
            type: "Server",
            languages: createLanguagesData(exampleId, "server", SERVER_LANGUAGES),
        },{
            type: "Client",
            languages: createLanguagesData(exampleId, "client", CLIENT_LANGUAGES)
        }]
    });
});

try {
    wrench.rmdirSyncRecursive("./bin");
} catch(e) {}

var source = fs.readFileSync("./src/index.html", "utf8").replace("__EXAMPLES__", examples.join("\n"));
fs.writeFileSync("./index.html", source);
