/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
   /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var video;







window.onload = function() {
    var tv = window.navigator.tv;
    video = document.getElementById('tv');
  
    if (!tv) {
        errlog ('failed to get tv. check permission.');
        return;
    }

    tv.getTuners().then (function onsuccess(tuners) {
        if (tuners.length == 0) {
            errlog ('getTuners() fail.');
            return;
        }
        tuners[0].setCurrentSource ('isdb-t').then(function onsuccess() {
            video.mozSrcObject = tuners[0].stream;  // for STB 
        }, function onerror(error) {
            errlog ('setCurrentSource() error');
        });
    }, function onerror(error) {
        errlog ('getTuners() error.');
   });
};
