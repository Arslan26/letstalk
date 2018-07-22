		var serverUrl = "http://talentchases.com/letstalk/";
		window.chatDay = "";
		// var serverUrl = "http://192.168.0.100/letstalk/";
		var imagesUrl = serverUrl+"storage/app/public/"
		// Initialise a new Pusher object
		var pusher = new Pusher('777b8db5ea3e364522ab', {
			authEndpoint : serverUrl,
		    encrypted: false,
		    cluster : 'ap2'
		});
		console.log("user id "+window.localStorage.getItem('user_id'));
		var channel = pusher.subscribe('chat_'+window.localStorage.getItem('user_id'));
		channel.bind('request.created', function(data) {
			sendMessage(data['message'], 'receiver');
		});

		function includeHTML(attr) {
		  var z, i, elmnt, file, xhttp;
		  /*loop through a collection of all HTML elements:*/
		  z = document.getElementsByTagName("*");
		  for (i = 0; i < z.length; i++) {
		    elmnt = z[i];
		    /*search for elements with a certain atrribute:*/
		    file = elmnt.getAttribute(attr);
		    if (file) {
		      /*make an HTTP request using the attribute value as the file name:*/
		      xhttp = new XMLHttpRequest();
		      xhttp.onreadystatechange = function() {
		        if (this.readyState == 4) {
		          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
		          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
		          /*remove the attribute, and call this function once more:*/
		         // elmnt.removeAttribute(attr);
		          includeHTML();
		        }
		      } 
		      xhttp.open("GET", file, true);
		      xhttp.send();
		      /*exit the function:*/
		      return;
		    }
		  }
		}


		$(document).on('click','.menu-opt .opt-btn', function(e){
			$('#options').toggle();
		})

		// logout
		$(document).on('click','.logout', function(e){
			localStorage.clear();
			$(".main-wraper").empty();
			includeHTML("login-view");
		})

		function notify(msg, type = 'success'){
			$.notify(msg, {
			  // whether to hide the notification on click
			  clickToHide: true,
			  // whether to auto-hide the notification
			  autoHide: true,
			  // if autoHide, hide after milliseconds
			  autoHideDelay: 5000,
			  // show the arrow pointing at the element
			  arrowShow: true,
			  // arrow size in pixels
			  arrowSize: 5,
			  // position defines the notification position though uses the defaults below
			  position: 'bottom left',
			  // default positions
			  elementPosition: 'top left',
			  globalPosition: 'top left',
			  // default style
			  style: 'bootstrap',
			  // default class (string or [string])
			  className: type,
			  // show animation
			  showAnimation: 'slideDown',
			  // show animation duration
			  showDuration: 400,
		 	 // hide animation
			  hideAnimation: 'slideUp',
			  // hide animation duration
			  hideDuration: 200,
			  // padding between element and notification
			  gap: 2
			});
		}

		// back to main 
		$(document).on('click','.back-to-main', function(e){
	    	window.history.back();
		})

		// open user chat
		$(document).on('click','.open-chat li', function(e){
			/*$('.chat-receiver a').find('span').html($(this).find('span').html());
			$('.chat-receiver a').attr('data-id',$(this).attr('data-id'));
			getChats($(this).attr('data-id'));
			window.activePage = '#userChat';
			$('.friend-chat').show();
			$('.find-contact, .main-listings').hide();*/
			var friend_id = $(this).attr('data-id');
			var friend_name = $(this).attr('data-name');
			window.location.assign("friend_chat.html?friend_id="+friend_id+"&friend_name="+friend_name);

		})


		function sendMessage(data, type){
			$html = '';
			switch(type){
				case 'sender':
					$html += '<li data-toggle="modal" data-target=".chat-msg-modal" class="text-left">'+
					'<a><span> '+data['message']+'</span>';
							break;

				case 'receiver':
					$html += '<li data-toggle="modal" data-target=".chat-msg-modal" class="text-right">'+
					'<a><span> '+data['message']+'</span>';
				break;
			}
			if (data.file != null && data.file != "")
				$html += '<img src="'+getImage(data.file)+'" ></img>'
			$html +=' <small>'+formatAMPM(new Date(data['created_at']))+' </small></a></li>';
	        $('.friend-chat').find('.user-chat-wrap').append($html);
			$('#user-chat-wrap').scrollTop($('#user-chat-wrap')[0].scrollHeight);
		}

		function formatAMPM(date, format = '' ) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0'+minutes : minutes;
			var strTime = hours + ':' + minutes + ' ' + ampm;
			if(format == 'd M')
				strTime += ' '+date.getDate()+' '+getMonth(date.getMonth());
			return strTime;
		}

		function getWeekday(day){
			var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
			return days[day];
		}

		function getMonth(month){
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", 
				"Sep", "Oct", "Nov", "Dec"];
			return months[month];
		}

		$(document).on('show.bs.tab','a[data-toggle="tab"]', function (e) {
		    var target = $(e.target).attr("href");
		    console.log(target);
		    switch(target){
		    	case '#groups':
		    	 window.location.assign('groups.html');
		    	 break;
		    	case '#chat':
		    	window.location.assign('index.html');
		    	break;
		    }
		});


	function GetURLParameter(sParam){
	    
	   var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) 
	    {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam) 
	        {
	            return sParameterName[1];
	        }
	    }
	}

	function getImage(url){
		if(url == "" || url == 'null' || url == null || url == 'undefined')
			return 'img/user_icon.jpg';
		else 
			return imagesUrl+url;
	}



	
