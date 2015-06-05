// {{{ Visual settings
$(function() {
  function debounce(n,t,u){var e;return function(){var a=this,i=arguments,o=function(){e=null,u||n.apply(a,i)},r=u&&!e;clearTimeout(e),e=setTimeout(o,t),r&&n.apply(a,i)}}

  // {{{ Load settings
  try { var config = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s* )style\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
  } catch(e) { var config = {"dark":false,"justify":false,"serif":false,"size":1,"height":1,"zoom":1}; }
  function saveSettings() { document.cookie="style="+JSON.stringify(config)+"; expires="+new Date(Date.now()+31536e3).toUTCString(); }
  saveSettings();
  // }}}

  // {{{ Apply loaded settings
  if (config.dark) $("html").addClass("dark");
  if (config.justify) { $("html").addClass("justify"); $("#align i").toggleClass("icon-left icon-justify"); }
  if (config.serif) $("html").addClass("serif");
  // }}}

  // {{{ Menu scroll hiding
  var lst = $(window).scrollTop();
  $(window).scroll(debounce(function() {
    var st = $(window).scrollTop();
    if (st >= lst) { $("#header-container").addClass("hide");
      $("#controls").removeClass("read sub");
    } else { $("#header-container").removeClass("hide"); }
    lst = st;
  }, 125));
  // }}}

  // {{{ Menu buttons
  $("#sub").click(function() { $("#controls").removeClass("read").toggleClass("sub"); });
  $("#read").click(function() { $("#controls").removeClass("sub").toggleClass("read"); });
  // }}}

  // {{{ Settings
  // {{{ Toggles
  $("#dark").click(function() { $("html").toggleClass("dark"); config.dark = !config.dark; saveSettings(); });
  $("#align").click(function() { $("html").toggleClass("justify"); $("#align i").toggleClass("icon-left icon-justify"); config.justify = !config.justify; saveSettings(); });
  $("#serif").click(function() { $("html").toggleClass("serif"); config.serif = !config.serif; saveSettings(); });
  // }}} 

  // {{{ Height
  var height = config.height || 1;
  function doheight() {
    config.height = height; saveSettings();
    $("#height-current").text(["1.25","1.5","1.75"][height]);
    if (height==0) { $("#height-minus").addClass("disabled");
       } else { $("#height-minus").removeClass("disabled"); }
    if (height==2) { $("#height-plus").addClass("disabled");
       } else { $("#height-plus").removeClass("disabled"); }
    $("html").removeClass("height-plus height-minus");
    if (height==0) $("html").addClass("height-minus");
    if (height==2) $("html").addClass("height-plus");
  } doheight();
  $("#height-plus" ).click(function() { height+=1; if (height>2) height=2; doheight(); });
  $("#height-minus").click(function() { height-=1; if (height<0) height=0; doheight(); });
  // }}}

  // {{{ Size
  var size = config.size || 1;
  function dosize() {
    config.size = size; saveSettings();
    $("#size-current").text(["80%","100%","120%"][size]);
    if (size==0) { $("#size-minus").addClass("disabled");
       } else { $("#size-minus").removeClass("disabled"); }
    if (size==2) { $("#size-plus").addClass("disabled");
       } else { $("#size-plus").removeClass("disabled"); }
    $("html").removeClass("size-plus size-minus");
    if (size==0) $("html").addClass("size-minus");
    if (size==2) $("html").addClass("size-plus");
  } dosize();
  $("#size-plus" ).click(function() { size+=1; if (size>2) size=2; dosize(); });
  $("#size-minus").click(function() { size-=1; if (size<0) size=0; dosize(); });
  // }}}

  // {{{ Zoom
  var zoom = config.zoom || 1;
  function dozoom() {
    config.zoom = zoom; saveSettings();
    $("#zoom-current").text(["75%","100%","125%"][zoom]);
    if (zoom==0) { $("#zoom-minus").addClass("disabled");
       } else { $("#zoom-minus").removeClass("disabled"); }
    if (zoom==2) { $("#zoom-plus").addClass("disabled");
       } else { $("#zoom-plus").removeClass("disabled"); }
    $("html").removeClass("zoom-plus zoom-minus");
    if (zoom==0) $("html").addClass("zoom-minus");
    if (zoom==2) $("html").addClass("zoom-plus");
  } dozoom();
  $("#zoom-plus" ).click(function() { zoom+=1; if (zoom>2) zoom=2; dozoom(); });
  $("#zoom-minus").click(function() { zoom-=1; if (zoom<0) zoom=0; dozoom(); });
  // }}}
  // }}}
}); // }}}

// {{{ Comment section interactivity
var initPost = function(p) {
  $(p).find(".comments-button").click(function() {
    $(this).css("display","none");
    $("#"+$(this).attr("id").replace("b","s")).css("display","block");
  });
  $(p).find(".add-comment-button").click(function() {
    $(this).css("display","none");
    $("#"+$(this).attr("id").replace("b","")).css("display","block");
  });
  $(p).find('#content input[type=submit]').click(function() {
    var data = $(this).parent().serialize();
    $(this).parent().addClass("working"); var s = $(this);
    $(this).parent().children().attr("disabled", "disabled");
    $.ajax({ type: "POST",
      url: $(this).parent().attr("action"), data: data,
      success: function() { var d = new Date();
        s.parent().css("display","none");
        $("#"+s.parent().attr("id").replace("ac","csc"))
          .append("<p class='comment'><span class='meta'>"+
            s.parent().children("input[name=name]").val()+" &middot; "+
            (d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear()+" "+
            (d.getHours()%12)+":"+("100"+d.getMinutes()).slice(-2)+" "+["AM","PM"][Math.floor(d.getHours()/12)]
            +"</span> &middot; "+$("<span>").text(s.parent().children("textarea").val()).prop("outerHTML")+"</p>");
      }
    });
    return false;
  });
  $(p).find('.flag').click(function() {
    if (!$(this).hasClass("active")) {
      $.get("http://penapi.adamhovorka.com/flag/"+$(this).attr("id"),function() {});
      $(this).addClass("active");
    }
  });
}; // }}}
