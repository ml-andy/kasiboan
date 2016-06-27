$(document).ready(function(){
	//Init
	var obj ={
		wrp: $('.wrapper'),
		fadespeed: 500,
		canwheel: true,
		hasWatchvideo: false,
		videohasready: 0,
		videoW: $(window).width(),
		videoH: $(window).height(),
		warningtxt: '請先欣賞完景點影片，即可往下繼續瀏覽。',
		videoID_loop:'722u9ZmgVtE',
		videoID_online:'eCiRnxgyLRk',
		nowpage: 1
	};
	

	//AddListener
	$(window).on("touchstart",function(){
		if(obj.mobile){
  			if(!$('.scroll_btn').hasClass('inMb')) $('.scroll_btn').addClass('inMb').fadeOut(obj.fadespeed);
  		}
	});
	$('.menua').click(function(){menuaClick($(this));});
	$('.player_ctrl').click(function(){
		if($(this).hasClass('on')){
			$(this).removeClass('on');
			obj.player.playVideo();
		}
		else{
			$(this).addClass('on');
			obj.player.pauseVideo();	
		}
	})
	$('.play_btn').click(function(){startVideo();});
	$('.scroll_btn').click(function(){scroll_btnclick();});
	$('.page1 .bg').each(bannerfc);
	$('.menubtn').click(function(){
		if($(this).hasClass('on'))showMenu(false);
		else showMenu(true);
	});
	$.address.change(addrChange);
	window.onmousewheel= function(e){onmousewheelfc(e);}
	$(window).resize(checkmobile);
	$(window).load(windowload);
	function windowload(){
		checkmobile();
		createVideo('player_loop',obj.videoID_loop,true);
		createVideo('player',obj.videoID_online,false);		
	}

	//Event
	function menuaClick(_o){
		showMenu(false);
		if(obj.menuTimeout) clearTimeout(obj.menuTimeout);
		obj.menuTimeout = setTimeout(function(){
			obj.nowpage = _o.attr('data-num');
			checknowpagescroll();
			$.address.value("/page"+obj.nowpage);
		},obj.fadespeed);		
	}
	function startVideo(){		
		obj.player_loop.pauseVideo();
		obj.player.playVideo();		
		$('#player_loop').fadeOut(obj.fadespeed);
		$('.player_ctrl').fadeIn(obj.fadespeed);
		$('#player').fadeIn(obj.fadespeed);
	}
	function createVideo(_o,_id,_autoplay){
		var _obj;		
		var _con = 0;
		if(obj.mobile){
			_con = 1;
			_autoplay=false;
		}
        _obj = new YT.Player(_o, {
          height: '100%',
          width: '100%',
          videoId: _id,
          playerVars:{
            'controls':_con,
            'autoplay':_autoplay,
            'enablejsapi':'0',
            'hd':'1',
            'rel':'0',
            'showinfo':'0',
            'modestbranding':'1',
            'cc_load_policy':'1',
            'wmode':'transparent'      
          },
          events: {
	        'onReady': videoReady,
	        'onStateChange': onPlayerStateChange
	      }
        });
        if(_o == 'player_loop')  obj.player_loop = _obj;
		else if(_o == 'player') obj.player = _obj;
    }
    function videoReady(event){
    	if(event.target.a.id == 'player_loop') obj.player_loop.mute();
    	obj.videohasready+=1;
    	if(obj.videohasready >=2){
    		showMenu(false);
    		setTimeout(function(){
    			showLoading(false);
    		},obj.fadespeed);    		
    	}
    }
    function onPlayerStateChange(event){
    	if(obj.mobile){
    		if(obj.player.getPlayerState() ==1){
    			$('.player_ctrl').addClass('on').fadeOut(obj.fadespeed);
    		}else $('.player_ctrl').removeClass('on').fadeIn(obj.fadespeed);
    	}
    	if(event.data == YT.PlayerState.ENDED){
    		if(event.target.a.id == 'player_loop') obj.player_loop.playVideo();
    		else if(event.target.a.id == 'player'){
    			obj.hasWatchvideo = true;
    			$('.player_ctrl').addClass('on');
    			obj.nowpage = 4;
    			checknowpagescroll();
				$.address.value("/page"+obj.nowpage);
    		}    		
    	}
    	if(obj.player.getPlayerState() ==1){
    		if(!$('.play_btn').hasClass('off')) $('.play_btn').addClass('off').fadeOut(obj.fadespeed);    		
    	}
    }
	function scroll_btnclick(){
		obj.nowpage+=1;
		checknowpagescroll();
		$.address.value("/page"+obj.nowpage);
	}	
	function bannerfc(){
		var _li = $(this).find('li'),
			_length = _li.length,
			_now = -1,_pre = -1;

		change();
		function change(){
			_now+=1;
			if(_now>_length-1)_now=0;
			if(_pre!=-1){
				_li.eq(_pre).fadeOut(obj.fadespeed);
				_li.eq(_now).fadeIn(obj.fadespeed);				
			}
			else _li.eq(_now).fadeIn(obj.fadespeed);
			_pre = _now;
			setTimeout(function(){change();},5000);
		}
	}
	function showMenu(_t){
		if(_t){
			$('.menudom').addClass('on');
			$('.menu').fadeIn(obj.fadespeed);
		}else{
			$('.menudom').removeClass('on');
			$('.menu').fadeOut(obj.fadespeed);
		}
		
	}
	function addrChange(){
    	var value = $.address.value();
		switch(value) {
			case '/':
				obj.nowpage = 1;
			break;
			case '/page1':				
				obj.nowpage = 1;
			break;
            case '/page2':
                obj.nowpage = 2;
            break;
            case '/page3':
                obj.nowpage = 3;
            break;
            case '/page4':
                obj.nowpage = 4;
            break;
            case '/page5':
                obj.nowpage = 5;
            break;
            case '/page6':
                obj.nowpage = 6;
            break;
            case '/page7':
                obj.nowpage = 7;
            break;
            default:
                // window.location.href = "/";
                obj.nowpage = 1;
            break;
		}
		checknowpage();
		$('.page_box').attr('class','page_box pg'+obj.nowpage);
		if(obj.mobile) $('html,body').animate({scrollTop:$('.page' + obj.nowpage).offset().top},obj.fadespeed);
    }
    function onmousewheelfc(e){
    	if(!obj.mobile){
    		e.preventDefault();
			if(obj.canwheel){
				obj.canwheel = false;
				setTimeout(function(){obj.canwheel=true;},obj.fadespeed);
				if(e.wheelDelta>0) obj.nowpage-=1;
				else obj.nowpage+=1;
				checknowpagescroll();
				$.address.value("/page"+obj.nowpage);
			}
    	}
	}
	function checknowpagescroll(){
		if(obj.nowpage<1) obj.nowpage=1;
		else if(obj.nowpage >= $('.page_box .page').length)obj.nowpage = $('.page_box .page').length;

		//scroll_btn
		var _canshow = true;
		if(obj.nowpage == $('.page_box .page').length) _canshow = false;
		else{
			//hasWatchvideo
			if(!obj.hasWatchvideo){
				if(!obj.mobile){
					if(obj.nowpage>=3){
						if(obj.nowpage!=3) alert(obj.warningtxt);
						obj.nowpage=3;
						_canshow=false;						
					}
				}
			}
		}
		if(_canshow){
			if(!$('.scroll_btn').hasClass('on')) $('.scroll_btn').addClass('on').fadeIn(obj.fadespeed);
		}else $('.scroll_btn').removeClass('on').fadeOut(obj.fadespeed);
	}
	function checknowpage(){
		//pageAni
		if(obj.nowpage==2) obj.page2Timeout = setTimeout(function(){$('.person_all').addClass('on');},obj.fadespeed);
		else{
			clearTimeout(obj.page2Timeout);
			$('.person_all').removeClass('on');
		}
		if(obj.nowpage==5) obj.page5Timeout = setTimeout(function(){$('.icon_all').addClass('on');},obj.fadespeed);
		else{
			clearTimeout(obj.page5Timeout);
			$('.icon_all').removeClass('on');
		}

		//checkvideo
		if($('.play_btn').hasClass('off')){
			if(obj.nowpage!=3){
				try{
					if(obj.player.getPlayerState() ==1) $('.player_ctrl').trigger("click");
				}catch(err){}			
			}else{
				try{
					if(obj.player.getPlayerState() !=5 && obj.player.getPlayerState() !=1) $('.player_ctrl').trigger("click");
				}catch(err){}			
			}
		}		
	}
  	function showLoading(_t){
  		if(_t) $('.loading').fadeIn(obj.fadespeed);
  		else $('.loading').fadeOut(obj.fadespeed);
  	}  	
  	function checkmobile(){
  		if(device.mobile()) obj.mobile = true;
		else{
			if($(window).width()<=1024) obj.mobile = true;
			else obj.mobile = false;		
		}		

		//page event
		if(obj.mobile){
			$('.page_box .page1').css('height',$(window).height());
			$('.page_box .page3').css('height',$(window).height());
			try{
				if(obj.player_loop.getPlayerState() ==1) obj.player_loop.pauseVideo();
				if(obj.player.getPlayerState() ==1) $('.player_ctrl').addClass('on');
				else $('.player_ctrl').removeClass('on');
			}catch(err){}			
			// $('html,body').animate({scrollTop:$('.page' + obj.nowpage).offset().top},obj.fadespeed);
		}else{
			$('.page_box .page1').attr('style','');
			$('.page_box .page3').attr('style','');
			try{
				if(!$('.play_btn').hasClass('off')) obj.player_loop.playVideo();
				else{
					obj.player_loop.pauseVideo();
					$('#player_loop').fadeOut(obj.fadespeed);
					$('.play_btn').fadeOut(obj.fadespeed);
				}
				if(obj.player.getPlayerState() ==1){					
					$('#player_loop').fadeOut(obj.fadespeed);
					$('.player_ctrl').removeClass('on').fadeIn(obj.fadespeed);					
				}else{
					if(!$('.play_btn').hasClass('off')) $('.player_ctrl').removeClass('on').fadeOut(obj.fadespeed);
					else $('.player_ctrl').addClass('on').fadeIn(obj.fadespeed);
				}
			}catch(err){}			
			checknowpagescroll();
		}

		//video width height
		if(obj.mobile){
			obj.videoW = $('.page_box .page3').width();
		    obj.videoH = $('.page_box .page3').height();
		}else{
			var _w = $('.page_box .page3').width() / $('.page_box .page3').height();
			var _v = 640 / 360;
			if(_w>_v){
		        obj.videoW = $('.page_box .page3').width();
		        obj.videoH = $('.page_box .page3').width() / _v;
		    }else if(_w<_v){
		    	obj.videoH = $('.page_box .page3').height();
		    	obj.videoW = obj.videoH * _v;
		    }else if(_w==_v){
		        obj.videoW = $('.page_box .page3').width();
		        obj.videoH = $('.page_box .page3').height();
		    }			
		}
		$('.video').css({'width':obj.videoW,'height':obj.videoH});
  	}
})//ready end  
































































































