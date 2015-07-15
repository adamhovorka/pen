$(function() {

// {{{ Utilities
function t(a,b){return function(c,d){return a.replace(/#{([^}]*)}/g,function(a,f){return Function("x","with(x)return "+f).call(c,d||b||{})})}}
function AJAX(a,b,c,d){try{d=new(this.XMLHttpRequest||ActiveXObject)("MSXML2.XMLHTTP.3.0"),d.open(c?"POST":"GET",a,1),d.setRequestHeader("X-Requested-With","XMLHttpRequest"),d.setRequestHeader("Content-type","application/x-www-form-urlencoded"),d.onreadystatechange=function(){d.readyState>3&&b&&b(d.responseText,d)},d.send(c)}catch(e){window.console&&console.log(e)}}

// Pretty date formatting
function todate(d) {
  d = new Date(d*1000);
  var h = d.getHours()%12;
  return (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+" "+
    (h>0?h:12)+":"+("100"+d.getMinutes()).slice(-2)+" "+["AM","PM"][Math.floor(d.getHours()/12)]; }
// }}}

// {{{ Templates
var sect = t($("#section-template").html());
var comm = t($("#comment-template").html());
// }}}

// {{{ Load comments for post `p`
function load(p) {

  var n = $(p).attr("data-index");

  // Load the post
  AJAX("http://penapi.adamhovorka.com/comments/"+n+"?t="+Date.now(), function(d) {

    // {{{ Process the comment file into an object
    d = d.split("\n");
    for (var i=0;i<d.length;i++) {
      if (d[i] == "") { d.splice(i,1); i--; }}
    // }}}

    // Initialize the comment store
    var o = {n:n,comments:"",ncomments:d.length};

    // {{{ Process and render each comment
    for (var i=0;i<d.length;i++) {
      var a = JSON.parse(d[i]); // Extract the comment
      a.n = n; a.i = i;         // Number it
      a.date = todate(a.date);  // Fancify the date
      o.comments += comm(a);    // Render it through the template
    } // }}}

    // Write out section
    $(p).append(sect(o));
    initPost($(p));
  });
} // }}}

// Load each post's comments
$(".post").each(function(){load(this);});

// {{{ Activate the hash
if (location.hash) {
  var a = location.hash;
  location.hash = "";
  location.hash = a;
} else {
  location.hash = "#"+$(".post").length;
} // }}}

});
