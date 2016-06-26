$(document).ready(function(){
	var webData ={};
	webData.wrp=$('.wrapper');

	//Init

	//AddListener
	$('.menubtn').click(function(){
		if($(this).hasClass('on'))showMenu(false);
		else showMenu(true);
	});
	$.address.change(addrChange);
	$(window).load(windowload);
	function windowload(){
		showLoading(false);
	}

	//Event
	function showMenu(_t){
		if(_t){
			$('.menudom').addClass('on');
			$('.menu').fadeIn();
		}else{
			$('.menudom').removeClass('on');
			$('.menu').fadeOut();
		}
		
	}
	function addrChange(){
    	var value = $.address.value();
		switch(value) {
			case '/':
				window.location.href = "index.html#/page1";
			break;
			case '/page1':
				webData.nowpage = '1_1';
			break;
            case '/page1?scenes=2':
                webData.nowpage = '1_2';
            break;
            case '/page1?scenes=3':
                webData.nowpage = '1_3';
            break;			
            default:
                window.location.href = "index.html#/page1";
            break;
		}
    }
  	function showLoading(_t){
  		if(_t) $('.loading').fadeIn();
  		else $('.loading').fadeOut();
  	}
  
})//ready end  
































































































