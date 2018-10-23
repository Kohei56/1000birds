var map;
var data = [];
var markers = [];
var markerCluster = [];
var currentInfoWindow = null;

function initMap() {
  //地図の作成
  var initLatlng = new google.maps.LatLng(39.570981, 136.881556);
  var mapOptions = {
      zoom: 5,
      center: initLatlng,
      mapTypeControl: false, //マップタイプ コントロール
      fullscreenControl: false, //全画面表示コントロール
      streetViewControl: false, //ストリートビュー コントロール
  }
  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  //JSONの取得
  $.getJSON("http://dev.9638works.com/api", function(json){
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

    //クラスター設定
    createCluster(map, markers);

    //リスナーの設定
    var clusterClicked = false;
    markerCluster.addListener('clusterclick', function(cluster){
        clusterClicked = true;
        console.log('Cluster click executed');
    });

    map.addListener('click', function(event) {
      setTimeout(function () {
        if (!clusterClicked) {
          openLocWindow(event.latLng, map);
          console.log('Map click executed');
        }
        else {
          if (currentInfoWindow) {
            currentInfoWindow.close();
          }
          clusterClicked = false;
          console.log('Map click not executed');
        }
      }, 0);
    });
  });
}

function createMarker(date, xem, lat, lng, message) {  
  var newMarker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    icon: {
      url:'img/turu.png',
      scaledSize: new google.maps.Size(60, 60)},
    map: map,
    message: message
  });

  var markerWindow = new google.maps.InfoWindow({
    content: `<div class="markerWindow"><p>日付：${date}</p><p>XEM：${xem}</p><p>メッセージ：${message}</p></div>`
  });

//  google.maps.event.addListener(newmarker, 'click', function() {
  newMarker.addListener('click', function() {
    if (currentInfoWindow) {
      currentInfoWindow.close();
    }

    markerWindow.open(map, newMarker);
    currentInfoWindow = markerWindow;
  });

  markers.push(newMarker);
}

function cpToClipborad(text){
  var input = document.createElement('input');
  input.setAttribute('id', 'copyinput');
  document.body.appendChild(input);
  input.value = text;
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

function geocodeLatLng(latlng, callback) {
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        callback(results[0].formatted_address);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });

}

function openLocWindow(latlng, map) {  
  if (currentInfoWindow) {
    currentInfoWindow.close();
  }

  lat = latlng.lat().toFixed(6);
  lng = latlng.lng().toFixed(6);
  tag = `#${lat},${lng}`;

  geocodeLatLng(latlng, function(address) {
    var nemAddress = 'TDSPP6QU3TMGI7AMSPPCBJQ7TU37ABGMLTH73CEH';
    var locWindow = new google.maps.InfoWindow({
      position: latlng,
      content: `<span class="font-weight-bold">ココに鶴を送る！</span><p>場所：${address}</p><button onclick="cpToClipborad('${tag}')">座標タグをコピー</button><span class="ml-3"></span><button onclick="cpToClipborad('${nemAddress}')">送信先アドレスをコピー</button>`
    });
    locWindow.open(map);
    currentInfoWindow = locWindow;

    map.panTo(latlng);
  });
}

function createCluster(map, markers){
  var clusterStyles = [
    {
      textColor: 'white',
      url: 'img/t1.png',
      height: 60,
      width: 60,
//      anchor: [1, 1]
    },
   {
      textColor: 'white',
      url: 'img/m2.png',
      height: 50,
      width: 50
    },
   {
      textColor: 'white',
      url: 'img/m3.png',
      height: 50,
      width: 50
    }
  ];

  var mcOptions = {
      gridSize: 50,
      styles: clusterStyles,
      maxZoom: 15
  };
  markerCluster = new MarkerClusterer(map, markers, mcOptions);
}



