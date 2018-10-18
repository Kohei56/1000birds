var map;
var data = [];
var marker = [];
var infoWindow = [];
var currentInfoWindow = null;
var locWindow = [];
var src = '';

function initMap() {
  //地図の作成
  var myLatlng = new google.maps.LatLng(35.170981, 136.881556);
  var myOptions = {
      zoom: 15,
      center: myLatlng,
      mapTypeControl: false, //マップタイプ コントロール
      fullscreenControl: false, //全画面表示コントロール
      streetViewControl: false, //ストリートビュー コントロール
  }
  map = new google.maps.Map(document.getElementById("map"), myOptions);

  //JSONの取得
  $.getJSON("http://localhost:3000/api", function(json){
    for (var i = 0; i <= json.length-1; i++) {
      data.push({
        'date': json[i].date,
        'xem': json[i].xem,
        'lat': json[i].lat,
        'lng': json[i].lng,
        'message': json[i].message
      });
    };

    //マーカーの設置
    for (var i = 0; i < data.length; i++) {
      createMarker(data[i]['date'], data[i]['xem'], data[i]['lat'], data[i]['lng'], data[i]['message']);
    }

    //コメントの読み込み
    for (var i = 0; i < data.length; i++) {
      createComment(i, data[i]['date'], data[i]['xem'], data[i]['lat'], data[i]['lng'], data[i]['message']);
    }
    $('#comments-list').append(src);

  });

  //クリック時のイベント
  map.addListener('click', function(e) {
    openLocWindow(e.latLng, map);
  });
}

function createMarker(date, xem, lat, lng, message) {  
  var newmarker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
//      icon: 'vine.png',
      map: map,
      message: message
  });

  newmarker['infowindow'] = new google.maps.InfoWindow({
          content: `<p>${date} ${xem}XEM</p><p>${message}</p>`
      });

//  google.maps.event.addListener(newmarker, 'click', function() {
  newmarker.addListener('click', function() {
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }

      this['infowindow'].open(map, this);
      currentInfoWindow = this['infowindow'];
  });
  
  marker.push(newmarker);
}

function createComment(i, date, xem, lat, lng, message){
  console.log(i)
  src += `<div class="comment"><p>${date} ${xem}XEM</p><p>${message}</p><p>位置情報：<a href="#" onClick="gotoPoint(${i});">${lat}, ${lng}</a></p></div>`;
}

function openLocWindow(lat_Lng, map) {  
  if (currentInfoWindow) {
    currentInfoWindow.close();
  }

  var locWindow = new google.maps.InfoWindow({
    position: lat_Lng,
    content: 'ココに鶴を送る！'
  });
  locWindow.open(map);
  currentInfoWindow = locWindow;

  map.panTo(lat_Lng);
}

function gotoPoint(myPoint){
    if (currentInfoWindow) {
      currentInfoWindow.close();
    }

    map.setCenter(new google.maps.LatLng(marker[myPoint].position.lat(), marker[myPoint].position.lng()));
    marker[myPoint]['infowindow'].open(map, marker[myPoint]);

    currentInfoWindow = marker[myPoint]['infowindow'];
    console.log(data.length);
}
