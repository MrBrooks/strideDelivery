/**************************************/
/* Custom JavaScript files supervisor */
/**************************************/

$(document).ready(function() {

    /* Custom */

 /*    //= ./common/material-init.js */
 /*    //= ./common/google-analytics.js */

function screenType(desktop, tablet, mobile){

  var width = $(window).width();
  if(width >= desktop){
    return "desktop";
  }
  if(width < desktop && width >= tablet){
    return "tablet";
  }
  return "mobile";
}

(function( $ ){

  $.fn.strideDelivery = function() {  
    
    var btn_delivery = this.find("#btn-delivery"),
        btn_self = this.find("#btn-self"),
        block_delivery = this.find("#delivery-block"),
        block_self = this.find("#self-block"),
        delivery_types = this.find(".delivery-type>.type"),
        slidespeed = 250, noEventFlag = true;
    
    function activateDelivery(){
      if(noEventFlag){
        noEventFlag = false;
        setTimeout(function(){noEventFlag = true; },100);
        block_delivery.slideDown(slidespeed).addClass("active");
        btn_delivery.addClass("active");
        btn_self.removeClass("active");
        block_self.slideUp(slidespeed).removeClass("active");
      }
    }
    function activateSelf(){
      if(noEventFlag){
        noEventFlag = false;
        setTimeout(function(){noEventFlag = true;},100);
        block_delivery.slideUp(slidespeed).removeClass("active");
        btn_delivery.removeClass("active");
        btn_self.addClass("active");
        block_self.slideDown(slidespeed).addClass("active");
      }
    }
    function deliveryTypeClick(){

      var parent = $(this).parent();
      var other_content = parent.siblings().children(".delivery-content"),
          content = parent.children(".delivery-content");
      if(noEventFlag){
        noEventFlag = false;
        setTimeout(function(){noEventFlag = true;},100);
        other_content.slideUp(slidespeed);
        content.slideToggle(slidespeed, function(){
          parent.toggleClass("active").siblings().removeClass("active");
        });
        
        $("#delivery-submit").attr("form", "form_"+parent.attr("id"));
      }
    }

    function init(){
      var event = "click tap";
      // if(screenType(1024,768) === "desktop"){
      //   event = "click";
      // } else{
      //   event = "touchend";
      // }

      btn_self.on(event,function(){
        activateSelf();
        $("#delivery-submit").attr("form", "form_self");
      });
      btn_delivery.on(event,activateDelivery);
      delivery_types.on(event, deliveryTypeClick);
    }
    
    init();
    
    return this;

  };
})( jQuery );

(function( $ ){

  $.fn.priceFormat = function(n, separ, symb) {
  
    return this.each(function() {
      var nums = $(this).text().split("").reverse(), m = Math.floor(nums.length / n), result="";
      for(var i = 0; i < m; i++){
        nums.splice((i+1)*n, 0, separ);
      }
      nums.splice(0,0,symb.valueOf()," ");
      nums = nums.reverse();
      for(i = 0; i < nums.length; i++){
        result += nums[i];
      }
      $(this).text(result);
    });
  };
})( jQuery );

// MRBROOKS COMMEN: форматирование телефона

$('.phone').formatter({
  'pattern': '+7 ({{999}}) {{999}}-{{99}}-{{99}}',
  'persistent': false
});

// MRBROOKS COMMEN: красивое форматирование цен - нужно только число, пробелы и символ рубля выставятся автоматом
$(".rub-format").priceFormat(3," ","\u20BD");

function initAutocomplete(selector){
  var list = $("#destinations-list>li"), list_text = [], timer, self = $(selector);
  list.each(function(index){
    list_text.push($(this).text());
  });
  self.autocomplete({
    source: list_text,
  });
  self.tooltip({
    title: "Приносим извинения. На данный момент доставку в этот город мы не осуществляем.",
    trigger: "manual",
    // viewport: {padding: 15 },
    // placement: "right top",
    // container: "#tooltip-container"
  });
  self.on("keyup", function(){
    var ismatch = false, val;
    $(".tooltip.empty").removeClass("empty");
    setTimeout(function(){
      val = self.val().toLowerCase();
      for(var i = 0 ; i < list_text.length; i++){
        ismatch = ismatch || list_text[i].toLowerCase().includes(val);
      }
      if(!ismatch){
        self.tooltip('show');
      }
      else{
        self.tooltip('hide');
      }
    },200);
  });
  self.focusout(function(){
    var ismatch = false;
    val = self.val().toLowerCase();
    for(var i = 0 ; i < list_text.length; i++){
      ismatch = ismatch || list_text[i].toLowerCase() == val;
    }
    if(!ismatch){
      self.tooltip('show');
      self.attr("data-status","invalid");
    }
    else{
      self.tooltip('hide');
      self.attr("data-status","valid");
    }
  });
}

function mobileInit(){
  var cart = $("#cart");
  cart_items = cart.children("#cart-items");
  cart.children("label").on("touchend",function(){
    cart_items.slideToggle(300, function(){
      cart.toggleClass("active");
    });
  });
}

initAutocomplete("#destination_mail");
initAutocomplete("#destination_ems");

$("#stride-delivery").strideDelivery();
$("#cart-items").mCustomScrollbar({
  // setHeight: 540,
  theme: "stride-scrollbar"
});
$(".locality").tooltip({
  title: "Если населённый пункт совпадает с городом, это поле можно пропустить.",
  trigger: "hover focus"
});

if($(window).width() < 979){
  mobileInit();
}


// MRBROOKS COMMENT: валидация формы
$("form").submit(function(){
  var form = $(this), isValid = true, anotherTooltip = true;
  inputs = form.find("input");
  if(!$(inputs[0]).attr("data-status")){
    $(inputs[0]).tooltip({
      title: "Заполнены не все обязательные поля.",
      trigger: "manual"
    });
    anotherTooltip = false;
  }
  
  inputs.each(function(){
    if($(this).attr("requiredd") == "true" && $(this).val().length === 0){
      isValid = false;
      $(this).addClass('invalid');
    } else if($(this).attr('data-status') == 'invalid'){
      isValid = false;
      $(this).addClass('invalid');
    } else{
      $(this).removeClass('invalid');
    }
  });

  if(!isValid){
    $(inputs[0]).tooltip("show");
    if(anotherTooltip){
      $(inputs[0]).parent().find(".tooltip").addClass("empty").find(".tooltip-inner").text("Заполнены не все обязательные поля.");
    }
  } else{
    $(inputs[0]).tooltip("hide");
  }

  return isValid;
});

 
});

// var map;
// function initMap() {
//   map = new google.maps.Map(document.getElementById('delivery-map'), {
//     center: {lat: -34.397, lng: 150.644},
//     zoom: 8
//   });
// }
// initMap();
