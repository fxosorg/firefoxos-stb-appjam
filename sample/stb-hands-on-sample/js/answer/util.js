/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
   /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

function dbglog(msg) {
    console.log ('>>> ' + msg + '\n');
}

function errlog(msg) {
    console.log ('!!! ' + msg + '\n');
}

function TvTuning (ch) {
    var channel_number = ch.number;
    if (currentSource == null) {
        errlog ('currentSource is null');
        return;
    }
    currentSource.setCurrentChannel(channel_number).then(function onsucces() {
    }, function onerror(error) {
        errlog ('error setCurrentChannel : ' + ch.name + '.');
    });
}

function resetBanner() {
    chBanner.innerHTML="";
}

function createChannelBanner(channel) 
{
    chBanner.innerHTML='<div>'
                       +'地上Ｄ ' + makeChNumber(channel.number) + ' : ' + channel.name 
                       + '<br>'
                       +'</div>';
}

function createChannelProgramBanner(channel, program) 
{
    chBanner.innerHTML='<div>'
                       +'地上Ｄ ' + makeChNumber(channel.number) + ' : ' + channel.name + '<br>'
                       +program.title +'<br>'
                       +makeTime(program.startTime) +'<br>'
                       +makeTime(program.startTime + program.duration) +'<br>'
                       +program.description
                       +'</div>';
}

function makeChNumber(ch_num) {
    if(0 <= ch_num && ch_num <= 9) {
       return ('00' + ch_num);    
    }
    else if(10 <= ch_num && ch_num <= 99) {
       return ('0' + ch_num);    
    }
    else if(100 <= ch_num){
       return (ch_num);    
    }
    else { // for channel index number        
       return ('0' + ch_num);    
    }
}

function makeTime(time) {
    var date = new Date(time * 1000);
    var hours = date.getHours();
    var minutes = date.getMinutes();

    if(0 <= hours && hours <= 9) {
       var t_hours = "0" + hours;    
    }
    else {
       var t_hours = "" + hours;    
    }
    if(0 <= minutes && minutes <= 9) {
       var t_minutes = "0" + minutes;            
    }
    else {
       var t_minutes = "" + minutes;            
    }    
    return (t_hours + ':' + t_minutes);
}

function TvSetFrameSize(rate) {
    
    if(rate > 1) { rate = 1;}
    else if (rate < 0) { rate = 0; }
        
    var p = document.getElementById('tv').style;
    var l_width = 100 * rate;
    var l_height = 100 * rate;
    var l_top = (100 - l_height) / 2;
    var l_left = (100 - l_width) / 2;

    p.width = l_width + '%';
    p.height = l_height + '%';
    p.top = l_top + '%';
    p.left = l_left + '%';
}
