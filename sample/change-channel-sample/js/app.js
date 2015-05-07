window.addEventListener('DOMContentLoaded', function() {

  var video = document.getElementById("mainVideo");
  var tuners;
  var sources;
  var availableChannel = new Array();
  var currentChannelIdx = 0;
  
  // 1) Tuner 取得
  navigator.tv.getTuners().then(function(t){
    if(!t || t.length <= 0) {
      alert("チューナー初期化失敗");
    }
    tuners = t;
    
    // 2) Tuner のソースを「isdb-t」に初期化
    tuners[0].setCurrentSource('isdb-t').then(function(){
      
      // 3) 初期化成功後映像を再生
      video.mozSrcObject = tuners[0].stream;
      video.play();
      
      // 4) チャンネルを変更するためにソースを取得
      tuners[0].getSources().then(function(s){
        sources = s;
        
        // 5) 変更可能なチャネルの取得
        sources[0].getChannels().then(function(channels){
          for(var i=0; i<channels.length; i++) {
            availableChannel.push(channels[i].number);
          }
        });
      });
    });
  });
  
  window.addEventListener("keydown", function(ev) {
    console.log("keydown called[" + ev.keyCode + "]");
    if(ev.keyCode == 37) {
      // Left
      changeChannel(-1);
    } else if(ev.keyCode == 39) {
      // Right
      changeChannel(1);
    }
  });
  
  
  function changeChannel(diff) {
    if(!sources) {
      //初期化前
      console.log("初期化完了していません。");
      return;
    }
    
    currentChannelIdx += diff;
    if(currentChannelIdx < 0) currentChannelIdx = availableChannel.length-1;
    if(currentChannelIdx >= availableChannel.length) currentChannelIdx = 0;
    
    sources[0].setCurrentChannel(availableChannel[currentChannelIdx]).then(function(){
      console.log("チャンネル変更[" + availableChannel[currentChannelIdx] + "]");
    }, function() {
      console.log("チャンネル変更失敗");
    })
  }
});
