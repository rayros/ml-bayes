var should = require('should');
var Bayes = require('../lib/bayes');

describe("toJSON fromJSON tests", function() {
    var bayes = new Bayes({
            log: function() {
                return {
                    labels: this.labelsArray,
                    text: 'log test function serialization'
                };
            }
        }),
        jsonString;
    bayes.train('1 2 3 4 5 6', 'numbers');
    bayes.train('a b c d e f', 'alphabet');
    it('toJSON should work', function() {
        jsonString = bayes.toJSON();
        jsonString.should.be.type('string');
        jsonString.should.be.json;
    });
    it('fromJSON should work', function() {
        var newBayes = new Bayes();
        newBayes.fromJSON(jsonString);
        var log = newBayes.log()
        log.should.have.property('labels', ['numbers', 'alphabet']);
        log.should.have.property('text', 'log test function serialization');
        newBayes.tokenize.toString().should.be.equal(bayes.tokenize.toString());
    });
})
