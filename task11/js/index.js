var G = {
	DEV_HEIGHT : window.innerHeight,
	DEV_WIDTH : window.innerWidth,
	getByClass : function(className,index,obj){
		 
		var contain = obj ? obj : document,
			els = contain.getElementsByClassName(className);
		if(index === -1){
			return els;
		}else{
			index = typeof index === 'number' ? index : 0;
			return els[index];
		}
	},
	getByTag : function(tagName,index,obj){
		var contain = obj ? obj : document,
			els = contain.getElementsByTagName(tagName);
		if(index === -1){
			return els;
		}else{
			index = typeof index === 'number' ? index : 0;
			return els[index];
		}
	},
	runAnimation : function(animationName,options,duration){
		var target = null,
			i_left = '',
			f_left = '',
			speed =  '',
			result = 0,
			num = G.getByTag('li',-1, G.getByClass('slide-box') ).length;
		var slide_box =function(i_left){
			if( speed > 0 &&
				f_left - i_left < 0){
				
				target.style.left = f_left + 'px';
				return;

			}else if(speed < 0 &&
					f_left - i_left > 0){
				
				target.style.left = f_left + 'px';
				return;	
			}
			target.style.left = i_left + 'px';
			i_left += speed;
			setTimeout(function(){
				slide_box(i_left);
			},duration);	
		};
		switch(animationName){
			case 'slide_box_heder':

				target = options.target;
				i_left = target.offsetLeft;
				f_left = parseInt(G.DEV_WIDTH / num) * options.index  ;
				speed =  i_left -  f_left > 0 ? -options.speed : options.speed;
				setTimeout(function(){
					slide_box(i_left);
				},duration);

				break;
		
			case 'slide_box_imgs':
				target = options.target;
				i_left = i_left ? i_left : target.offsetLeft;
				f_left = G.DEV_WIDTH * options.index;
				speed =  i_left - f_left > 0 ? -options.speed : options.speed;

				setTimeout(function(){
					slide_box(i_left);
				},duration);
				break;
		}
	},
	brower : {
		u : navigator.userAgent,
	  isAndroid : navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1, //android终端
	 	isiOS : !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
	},
	is_loop : false
};

var App = {
	layoutApp : function(){
		G.DEV_HEIGHT = window.innerHeight;
		G.DEV_WIDTH = window.innerWidth;
		var header = G.getByClass('app-header');
		if(G.brower.isiOS){
			header.style.paddingTop = '2rem';
		}else{
			header.style.height = '3.5rem';
			header.style.lineHeight = '3.5rem';

		}
		var app_content = G.getByClass('app-content'),
			slide_box = G.getByTag('ul',0,G.getByClass('slide-box')),
			slide_box_imgs = G.getByTag('img',-1,slide_box),
			app_header_height = G.getByClass('app-header').offsetHeight,
			app_footer_height = G.getByClass('app-footer').offsetHeight,
			body = G.getByTag('body');

		app_content.style.height = (G.DEV_HEIGHT- 
									app_header_height- 
									app_footer_height)+'px';
		app_content.style.marginTop = app_header_height + 'px';
		app_content.style.marginBottom = app_footer_height + 'px';

		body.style.height = G.DEV_HEIGHT + 'px';
		body.style.width = G.DEV_WIDTH + 'px';	
		body.style.left ='0px';
		body.style.top ='0px';
		
		slide_box.style.width = slide_box_imgs.length*G.DEV_WIDTH + 'px';
		for(var i = 0 ;i<slide_box_imgs.length; i++ ){
			slide_box_imgs[i].style.width = G.DEV_WIDTH + 'px';
			slide_box_imgs[i].style.height = slide_box.offsetHeight + 'px';
		}
		return this;	
	},
	bindEvents : function(){
		function clickFun(e){
			var target = e.target,
				temp_node = target;
			
			while(temp_node){
				var tag =target.tagName.toLowerCase();
				if( temp_node.className && 
					temp_node.className.indexOf('app-footer')>-1 ){
					// 点击底部 按钮
					if( tag === 'img' || tag === 'a'){
						target = tag === 'img' ? target : G.getByTag('img',0,target);

						var imgsrc = target.getAttribute('src'),
							app_footer = G.getByClass('app-footer'),
							footer_imgs = G.getByTag('img',-1,app_footer);
							
							if(imgsrc.indexOf('normal')>-1){
								footer_imgs = Array.prototype.slice.call(footer_imgs);
								footer_imgs.every(function(img,index,imgs){
									
									if(img.getAttribute('src').indexOf('pressed') >-1){
										img.src = img.src.replace('pressed','normal'); 
										return false;
									}
									return true;
								}); 
								target.src = imgsrc.replace('normal','pressed'); 
							}
							break;
						}

					// 轮播导航
					}else if( temp_node.className && 
							  temp_node.className.indexOf('slide-box')>-1){
						if(tag === 'a'){
							var temp = G.getByTag('a',-1,target.parentNode),
								img_index = 0;
							for(var i = 0 ; i< temp.length ;i++ ){
								if(temp[i] == target){
									img_index = i; 
									break;
								}
							}
							G.runAnimation('slide_box_heder',{
								'target' :G.getByTag('span',0,target.parentNode),
								 index : img_index,
								 speed : 10
							},15);

							G.runAnimation('slide_box_imgs',{
								'target' : G.getByTag('ul',0,G.getByClass('slide-box')),
								index : -img_index,
								speed : 100
							},15);
							break;
						}
					}
				
				temp_node = temp_node.parentNode;
			}
		}
		var touchFun = (function(){
			
			var slide_box = G.getByTag('ul',0,G.getByClass('slide-box')),
				index = 0;
				events = {
					start : function(e){

						var touch = typeof e.touches !== 'undefined' ? e.touches[0] : e,
							temp = G.getByTag('img',-1,e.target.parentNode.parentNode);

						this.startPos = {
							x : touch.pageX,
							y : touch.pageY,
							time : (new Date()).valueOf()
						};
						this.imgnum = temp.length;
						for(var i = 0 ; i < temp.length ;i++){
							if(temp[i] === e.target){
								index = i;
								break;
							}
						}
						slide_box.addEventListener('touchmove',touchhader,false);
						slide_box.addEventListener('mousemove',touchhader,false);
						slide_box.addEventListener('touchend',touchhader,false);
						slide_box.addEventListener('mouseup',touchhader,false);
					},
					move : function(e){

						var touch = typeof e.touches !== 'undefined'  ? e.touches[0] : e;
						this.endPos = {
							x : touch.pageX - this.startPos.x,
							y : touch.pageY - this.startPos.y
						};
						slide_box.style.left = - G.DEV_WIDTH * index  + this.endPos.x + 'px';
					},
					end : function(e){
						var duration = (new Date()).valueOf() - this.startPos.time;
						if(parseInt(duration) > 100){
							if(this.endPos.x > 50){
								index -= 1;
							}else if(this.endPos.x < -50){
								index += 1;
							}
						}
						if(index<0) index = G.is_loop ? this.imgnum -1 : 0;
						if(index === this.imgnum ) index = G.is_loop ? 0 : this.imgnum -1 ;
						
						G.runAnimation('slide_box_heder',{
							'target' :G.getByTag('span',0,G.getByClass('slide-box')),
							 index : index,
							 speed : 10
						},15);
						G.runAnimation('slide_box_imgs',{
							'target' : slide_box,
							index : -index,
							i_left : parseInt(slide_box.offsetLeft), 
							speed : 50
						},15);
						slide_box.removeEventListener('touchmove',touchhader,false);
						slide_box.removeEventListener('mousemove',touchhader,false);
						slide_box.removeEventListener('touchend',touchhader,false);
						slide_box.removeEventListener('mouseup',touchhader,false);
					}
				};
			function touchhader(e){
				switch(e.type){
					case 'touchstart':
					case 'mousedown':
						events.start(e);
						break;
					case 'touchmove':
					case 'mousemove':
						events.move(e);
						break;
					case 'touchend':
					case 'mouseup':
						events.end(e);
						break;
				}	
			}
			slide_box.addEventListener('touchstart',touchhader,false);
			slide_box.addEventListener('mousedown',touchhader,false);
		})();
		G.getByTag('body').addEventListener('click',clickFun,false);
		G.getByTag('body').addEventListener('touchstart',clickFun,false);
		return this;
	}
};
window.onload = (function(){
	App.layoutApp().bindEvents();
	// 窗口变化，重排页面
	window.onresize = function(){
		App.layoutApp();
	};
})();
