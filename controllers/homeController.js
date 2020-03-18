exports.index = function (req, res) {
    res.render('index.ejs');
};

exports.filialuszn = function (req, res) {
    res.render('filialuszn.ejs');
};

exports.template = function (req, res) {
    res.render('template.ejs');
};

exports.about = function (req, res) {
    res.render('about.ejs');
};
