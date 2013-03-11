function ngram_bag(word, n){
  var bag = {};
  for (var i = word.length - n; i >= 0; i--){
    bag[ word.substr(i, n) ] = true;
  }
  return bag;
}
function scale(v){
  return lscale(lscale(lscale(lscale(v))));
}
function lscale(v){
  return Math.log( 1 + (Math.E - 1) * v );
}
function size(obj){
  var size = 0;
  for (var _ in obj) size++;
  return size;
}
function key_filter(obj, re){
  var rv = {};
  for (var k in obj)
    if (k.match(re))
      rv[k] = obj[k];
  return rv;
}
function transpose(matrix){
  var rv = {};
  for (var k in matrix)
    for (var j in matrix[k]) {
      if (!rv[j]) rv[j] = 0;
      rv[j]++;
    }
  return rv;
}

var scores = {};
$(function(){

  var fill = {
    ab: "rgb(255,0,0)",
    no: "rgb(0,0,255)",
    mid: "rgb(255,255,255)"
  };

  var $cloud = {
    ab: $('#ab-cloud'),
    no: $('#no-cloud'),
    mid: $('#mid-cloud')
  };

  var ctx = $('#scatter')[0].getContext('2d');

  $.getJSON('words.json', function(words){
    var n = 2;

    console.log('loading corpus');

    // generate a corpus, where each word is a bag of n-grams
    var corpus = {};
    words.forEach(function(word){
      corpus[word] = ngram_bag(word, n);
    });

    console.log('loading terms');
    var freqs = transpose(corpus);

    console.log('loading terms co-occuring with ab');
    var ab_freqs = transpose(key_filter(corpus, /ab/));

    console.log('loading terms co-occuring with no');
    var no_freqs = transpose(key_filter(corpus, /no/));

    console.log('scoring and clustering');
    for (var ngram in freqs){
      var idf = 1 / freqs[ngram];
      var ab_tf = ab_freqs[ngram] || 0;
      var no_tf = no_freqs[ngram] || 0;
      scores[ngram] = { ab: ab_tf * idf, no: no_tf * idf, mid: (0.5*ab_tf + 0.5*no_tf)*idf };

      var k = (ab_tf > no_tf) ? 'ab' : (ab_tf < no_tf) ? 'no' : 'mid';

      $('<span/>').text( ngram ).appendTo( $cloud[k] ).css('font-size', 4 + 76 * scores[ngram][k] ); 

      ctx.fillStyle = fill[k];
      ctx.fillRect( 10 + 500 * scale(scores[ngram].no), 10 + 500 * (1 - scale(scores[ngram].ab)), 2, 2 );
    }
  });
})
