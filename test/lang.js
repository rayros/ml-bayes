var should = require('should'),
    Bayes = require('../lib/bayes');

describe("Train Naive Bayes", function() {
    var langBayes = new Bayes();
    langBayes.train("In machine learning, naive Bayes classifiers are a family of simple probabilistic classifiers based on applying Bayes theorem with strong (naive) independence assumptions between the features. Naive Bayes has been studied extensively since the 1950s. It was introduced under a different name into the text retrieval community in the early 1960s and remains a popular (baseline) method for text categorization, the problem of judging documents as belonging to one category or the other (such as spam or legitimate, sports or politics, etc.) with word frequencies as the features. With appropriate preprocessing, it is competitive in this domain with more advanced methods including support vector machines. It also finds application in automatic medical diagnosis.", 'English');

    langBayes.train("Ein Bayes-Klassifikator (Aussprache: [beɪz], benannt nach dem englischen Mathematiker Thomas Bayes), ist ein aus dem Satz von Bayes hergeleiteter Klassifikator. Er ordnet jedes Objekt der Klasse zu, zu der es mit der größten Wahrscheinlichkeit gehört, oder bei der durch die Einordnung die wenigsten Kosten entstehen. Genau genommen handelt es sich um eine mathematische Funktion, die jedem Punkt eines Merkmalsraums eine Klasse zuordnet.", 'German');

    langBayes.train("Naiwny klasyfikator bayesowski – prosty klasyfikator probabilistyczny. Naiwne klasyfikatory bayesowskie są oparte na założeniu o wzajemnej niezależności predyktorów (zmiennych niezależnych). Często nie mają one żadnego związku z rzeczywistością i właśnie z tego powodu nazywa się je naiwnymi. Bardziej opisowe jest określenie – „model cech niezależnych”. Ponadto model prawdopodobieństwa można wyprowadzić korzystając z twierdzenia Bayesa.", 'Polish');

    var scores = langBayes.guess('Pomimo ich naiwnego projektowania i bardzo uproszczonych założeń, w wielu rzeczywistych sytuacjach naiwne klasyfikatory Bayesa często pracują dużo lepiej, niż można było tego oczekiwać.');
    var winner = langBayes.extractWinner(scores);

    it('winner should have polish property label', function() {
        winner.should.have.property('label', 'Polish');
    });
});
