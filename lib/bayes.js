(function (root, factory) {
  if(typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Bayes = factory(root);
  }
}(this, function() {
    Array.prototype.unique = function () {
        var u = {}, a = [];
        for (var i = 0, l = this.length; i < l; ++i) {
            if (u.hasOwnProperty(this[i])) {
                continue;
            }
            a.push(this[i]);
            u[this[i]] = 1;
        }
        return a;
    };
    function Bayes (paramsObject) {
        paramsObject = paramsObject || {};
        this.labelsArray = [];
        this.stemKey = {};
        this.stemCountKey = {};
        this.docCountKey = {};
        this.tokenize = paramsObject.tokenize || this.defaultTokenize;
        this.log = paramsObject.log || this.defaultLog;
    }
    Bayes.prototype.defaultLog = function () {
        console.log.apply(console, arguments);
    }
    Bayes.prototype.defaultTokenize = function (text) {
        return text.toLowerCase().replace(/\W/g, ' ').replace(/\s+/g, ' ').trim().split(' ').unique();
    };
    Bayes.prototype.registerLabel = function (label) {
        if(this.labelsArray.indexOf(label) === -1) {
            this.labelsArray.push(label);
            return true;
        }
        return false;
    };
    Bayes.prototype.getLabels = function () {
        return this.labelsArray;
    };
    Bayes.prototype.getStemLabelCount = function (stem, label) {
        return this.stemKey[stem] ? this.stemKey[stem][label] ? this.stemKey[stem][label] : 0 : 0;
    };
    Bayes.prototype.getStemInverseLabelCount = function (stem, label) {
        var that = this;
        return this.getLabels().reduce(function (total, labelFromArray) {
            return total + (labelFromArray !== label ? that.getStemLabelCount(stem, labelFromArray) : 0);
        }, 0);
    };
    Bayes.prototype.getStemTotalCount = function (stem) {
        return this.stemCountKey[stem] ? this.stemCountKey[stem] : 0;
    };
    Bayes.prototype.getDocCount = function (label) {
        return this.docCountKey[label] ? this.docCountKey[label] : 0;
    };
    Bayes.prototype.getDocInverseCount = function (label) {
        var that = this;
        return this.getLabels().reduce(function (total, labelFromArray) {
            return total + (labelFromArray !== label ? that.getDocCount(labelFromArray) : 0);
        }, 0);
    };
    Bayes.prototype.incrementStem = function (stem, label) {
        this.stemCountKey[stem] = this.stemCountKey[stem] ? this.stemCountKey[stem] + 1 : 1;
        if(this.stemKey[stem]) {
            (this.stemKey[stem][label] = this.stemKey[stem][label] ? this.stemKey[stem][label] + 1 : 1);
        } else {
            this.stemKey[stem] = {};
            this.stemKey[stem][label] = 1;
        }
    }
    Bayes.prototype.incrementDocCount = function (label) {
        this.docCountKey[label] = this.docCountKey[label] ? this.docCountKey[label] + 1 : 1;
    };
    Bayes.prototype.train = function (text, label) {
        this.registerLabel(label);
        var words = this.tokenize(text),
            that = this;
        words.forEach(function (word) {
           that.incrementStem(word, label);
        });
        this.incrementDocCount(label);
    };
    Bayes.prototype.guess = function (text) {
        var that = this,
            words = this.tokenize(text),
            scores = {};
        this.getLabels().forEach(function (label) {
            var logSum = 0,
                wordicity;
            words.forEach(function (word) {
                var stemTotalCount = that.getStemTotalCount(word);
                if(stemTotalCount !== 0) {
                    var wordProbability = that.getStemLabelCount(word, label) / that.getDocCount(label),
                        wordInverseProbability = that.getStemInverseLabelCount(word, label) / that.getDocInverseCount(label);
                    wordicity = wordProbability / (wordProbability + wordInverseProbability);
                    wordicity = ( (1 * 0.5) + (stemTotalCount * wordicity) ) / ( 1 + stemTotalCount );
                    if (wordicity === 0) wordicity = 0.01;
                    else if (wordicity === 1) wordicity = 0.99;
                    logSum += (Math.log(1 - wordicity) - Math.log(wordicity));
                    that.log(label + "icity of " + word + ": " + wordicity);
                }
            });
            scores[label] = 1 / ( 1 + Math.exp(logSum) );
        });
        return scores;
    };
    Bayes.prototype.extractWinner = function (scores) {
        var bestScore = 0;
        var bestLabel = null;
        for (var label in scores) {
            if (scores[label] > bestScore) {
                bestScore = scores[label];
                bestLabel = label;
            }
        }
        return {label: bestLabel, score: bestScore};
    };
    return Bayes;
}));
