var userName="";
var icon2="";
var address="";
var image="";
$.support.cors = true;

var gMapsLoaded  = false;
var google_key='AIzaSyDWjiLneySGXLOZLuMbzYmJoTHFFqMlqqQ';
var google_url='https://maps.googleapis.com/maps/api/js?key='+google_key+'&callback=gMapsCallback';
var google_url2="https://maps.google.com/maps?file="+google_key+"&amp;v=3&amp;sensor=false";
var google_url3="https://maps.googleapis.com/maps/api/js?key="+google_key+"&libraries=places&callback=gMapsCallback";
window.gMapsCallback = function(){
  gMapsLoaded = true;
  $(window).trigger('gMapsLoaded');
}

window.loadGoogleMaps=function(){
  if(gMapsLoaded) return window.gMapsCallback();
  var script_tag = document.createElement('script');
  var script_tag2 = document.createElement('script');
  var script_tag3 = document.createElement('script');

  script_tag.setAttribute("type","text/javascript");
  script_tag.setAttribute("src",google_url);
  script_tag2.setAttribute("type","text/javascript");
  script_tag2.setAttribute("src",google_url2);
  script_tag3.setAttribute("type","text/javascript");
  script_tag3.setAttribute("src",google_url3,'async defer');
  (document.getElementsByTagName("head")[0]||document.documentElement).appendChild(script_tag3);
}
$(document).ready(function(){

  $('.toronto').click(function(){
    address='toronto';
    $(window).bind('gMapsLoaded',showMap);
    window.loadGoogleMaps();
    var clear='';
    $('body').find('h1').text(clear);
    $('body').find('.wrapper').remove();
  });

  $('.hongkong').click(function(){
    address='hongkong central';
    $(window).bind('gMapsLoaded',showMap);
    window.loadGoogleMaps();
    var clear='';
    $('body').find('h1').text(clear);
    $('body').find('.wrapper').remove();
  });

  $('.tokyo').click(function(){
    address='tokyo';
    $(window).bind('gMapsLoaded',showMap);
    window.loadGoogleMaps();
    var clear='';
    $('body').find('h1').text(clear);
    $('body').find('.wrapper').remove();
  });

  $('.paris').click(function(){
    address='paris';
    $(window).bind('gMapsLoaded',showMap);
    window.loadGoogleMaps();
    var clear='';
    $('body').find('h1').text(clear);
    $('body').find('.wrapper').remove();
  });

  $('#location').keydown(function(event){
    if(event.keyCode=='13'){
      event.preventDefault();
      address = $('input[name=location]').val();
      $(window).bind('gMapsLoaded',showMap);
      window.loadGoogleMaps();
      var clear='';
      $('body').find('h1').text(clear)
      $('body').find('.wrapper').remove();
    }
  });

  $('.close').click(function(){
    $('#popup_window').hide();
    $('#popup_window_resturant').hide();
    $('#popup_window_login').hide();
  });

  $('#no').click(function(){
    $('#popup_window_resturant').hide();
  });

  $('#Login').click(function(event){
    if($('#popup_window_login').css('display')==='none'){
      $('#popup_window_login').show();
    }
    event.preventDefault();
  })


  $('#findbutton').click(function(){
    address = $('input[name=location]').val();
    $(window).bind('gMapsLoaded',showMap);
    window.loadGoogleMaps();
    var clear='';
    $('body').find('h1').text(clear)
    $('body').find('.wrapper').remove();
  })

  function showMap(){
    //address = $('input[name=location]').val();
    var key_words = $('#key_words').text();
    var geocoder = new google.maps.Geocoder();
    var lat = "";
    var lon = "";
    geocoder.geocode({'address':address}, function(results, status){
      if (status==google.maps.GeocoderStatus.OK){
         lat = results[0].geometry.location.lat();
         lon = results[0].geometry.location.lng();

         var pyrmont={lat:lat,lng:lon};

         var mapOptions={
           zoom:13,
           center:new google.maps.LatLng(lat,lon),
           //mapTypeId:google.maps.MapTypeId.ROADMAP
         };
         map = new google.maps.Map(document.getElementById('map'),mapOptions);
         infowindow=new google.maps.InfoWindow();
         var service =new google.maps.places.PlacesService(map);
         service.nearbySearch({
           location:pyrmont,
           radius:2000,
           type:[key_words]
         },callback);
       }
    })
  }
  function callback(results, status) {
    $('#restaurant_list').find('.content').remove();
    $('#restaurant_list').find('table').remove();
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      if(results.length<20){
        for (var i = 0; i < results.length; i++) {
          var table_data='<table class="table table-hover table-striped">';
          var rating='';
          rating=Math.round(results[i].rating);
          createMarker(results[i]);
          createPhotoMarker(results[i])
          table_data+="<tr>";
          table_data+="<td>"+'<img class="restaurantpic" src="'+icon2+'">'+"</td>"+"<td class='restaurant_name' name='restaurant_name'>"+results[i].name+"<td>"+results[i].vicinity+"</td>"+"</td>"+"<td>"+results[i].rating+"/5"+"</td>";
          table_data+="<td>";
          if(rating>0){
            for(var k=0; k<rating; k++){
              table_data+="<span class='fa fa-star checked'></span>"
            }
          };
          table_data+="</td>"
          table_data+="</tr></table>";
          $("#restaurant_list").append(table_data);
        }
      }else{
          for (var i = 0; i < 20; i++) {
            var table_data='<table class="table table-hover table-striped">';
            createMarker(results[i]);
            createPhotoMarker(results[i])
            var rating='';
            rating=Math.round(results[i].rating);
            table_data+="<tr>";
            table_data+="<td>"+'<img class="restaurantpic" src="'+icon2+'">'+"</td>"+"<td class='restaurant_name' name='restaurant_name'>"+results[i].name+"<td>"+results[i].vicinity+"</td>"+"</td>"+"<td>"+results[i].rating+"/5"+"</td>";
            table_data+="<td>"
            if(rating>0){
              for(var k=0; k<rating; k++){
                table_data+="<span class='fa fa-star checked'></span>"
              }
            };
            table_data+="</td>"
            table_data+="</tr></table>";
            $("#restaurant_list").append(table_data);
        }
      }


      $('tr').click(function(){
        currentTable=$(this).closest('table');
        var table=$(this).closest('table');
        var restaurantN = $(this).find('td').eq(1).text();
        image= $(this).find('td').eq(0).find('img').attr('src');
        var address=$(this).eq(0).find('td').eq(2).text();
        var rating=$(this).eq(0).find('td').eq(3).text();
        $('#restaurant_window').find('img').remove();
        $('#restaurant_window').find('p').remove();
        $('#restaurant_window').append('<img id="popupPic" src="'+image+'">');
        $('#restaurantN').val(restaurantN);
        $('#restaurantN_appear').append('<p>'+restaurantN+'</p>');
        $('#restaurantAddress').val(address);
        $('#restaurantAddress_appear').append('<p>'+address+'</p>');
        $('#restaurantRating').val(rating);
        $('#restaurantRating_appear').append('<p>'+rating+'</p>');
        $('#restaurant_image').val(image);
        if($('#popup_window_resturant').css("display")==="none"){
          $('#popup_window_resturant').show();
        }else{
          $('#popup_window_resturant').hide();
        };
      })

/*
      $('.close').click(function(){
        $('#popup_window').hide();
        $('#popup_window_resturant').hide();
        $('#popup_window_login').hide();
      });*/
  }



  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

  function createPhotoMarker(place){
    var photos = place.photos;
    if(!photos){
      return;
    }

    var marker = new google.maps.Marker({
      //map:map,
      position:place.geometry.location,
      title:place.name,
      icon:photos[0].getUrl({'maxWidth':135, 'maxHeight':135})
    });
    icon2=(marker.icon);
  }
}
})

$(function(){
  var counter=$('#counter').text();
  if(counter==''){
    console.log(counter);
  }else{
    window.setTimeout(function(){
      location.href='/';
    },3000);
  }
})

$(function(){
  var sWidth=$('#focus').width();
  var len=$('#focus ul li').length;
  var index=0;
  var picTimer

  var btn="<div class='btn'>";
  for(var i=0;i<len;i++){
    btn+="<span></span>";
  }
  btn+="</div>";
  btn+="<div class='preNext pre'></div>"+"<div class='preNext next'></div>"+"<span class='hidden left'></span>"+"<span class='hidden right'></span>";
  $('#focus').append(btn);

  $('#focus div.btn span').css('opacity',0.4).mouseenter(function(){
    index=$('#focus div.btn span').index(this);
    showPics(index);
  });

  $('#focus span.left').hover(function(){
      $('#focus div.pre').animate({opacity:'0.5'},500);
  },function(){
      $('#focus div.pre').animate({opacity:'0'},500);
  });
  $('#focus span.right').hover(function(){
      $('#focus div.next').animate({opacity:'0.5'},500);
  },function(){
      $('#focus div.next').animate({opacity:'0'},500);
  });

  $('#focus span.left').click(function(){
    if(index == -1) {index = len - 1;}
    showPics(index);
    index--;
  });

  $('#focus span.right').click(function(){
    if(index==len){
      index=0;
      shoFirstPic();
    }else{
      showPics(index);
    }
    index++;
  });
  $("#focus ul").css("width",sWidth * (len+1));

  $('#focus').hover(function(){
    clearInterval(picTimer);
  },function(){
    picTimer=setInterval(function(){
      if(index==len){
        index=0;
        showFirstPic();
      }else{
        showPics(index);
      }
      index++;
    },2000);
  });
  function showPics(index){
    var nowLeft=-index*sWidth;
    $('#focus ul').stop(true,false).animate({"left":nowLeft},500);
    $('#focus div.btn span').animate({"opacity":"0.4"},300).eq(index).animate({"opacity":"1"},100);
  }
  function showFirstPic(){
    $("#focus ul").append($('#focus ul li:first').clone());
    var nowLeft=-len*sWidth;
    $('$focus ul').stop(true,false).animate({'left':nowLeft},500,function(){
      $('#focus ul').css("left","0");
      $('#focus ul li:last').remove();
    });
    $('#focus div.btn span').animate({"opacity":"0.4"},300).eq(index).animate({'opacity':'1'},100);
  }
});
