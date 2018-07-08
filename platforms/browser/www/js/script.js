
		// var serverUrl = "http://talentchases.com/letstalk/";
		window.chatDay = "";
		var serverUrl = "http://192.168.0.100/letstalk/";
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

		if(window.localStorage.getItem('unique_id') === null)
			includeHTML("login-view");
		else {
			includeHTML("main-view");
			loadUserChats();
		}

		// signup call
		jQuery(document).on('submit','.sign-up-htm', function(e){
        	e.preventDefault();
        	var formData = new FormData(this);
        	var ref = $(this);
			$.support.cors=true;
			$.ajax({
				url:serverUrl+"user/signup",
				type:"POST",
				data:formData,
				contentType: false,
		        cache: false, 
		        crossDomain:true,
		        processData:false,
		        beforeSend:function(){
		          
		        },
		        success: function( data ) {
		        	response = JSON.parse(data)
		        	if(response['isSuccess']){
		        		ref.find('input').not('input[type="submit"]').val("");
		        		notify(response['data'], 'success')
		        		$('.sign-in').trigger('click');
		        	}

		          console.log(data)
		        },
		        error:function(data){
		          console.log(data);
		        }	
			});
		})

		// sign in
		$(document).on('submit','.sign-in-htm', function(e){
			e.preventDefault();
        	var formData = new FormData(this);
        	var ref = $(this);
			$.support.cors=true;
			$.ajax({
				url:serverUrl+"user/login",
				type:"POST",
				data:formData,
				contentType: false,
		        cache: false, 
		        crossDomain:true,
		        processData:false,
		        beforeSend:function(){
		          
		        },
		        success: function( data ) {
		        	response = JSON.parse(data);
		        	if(response['isSuccess']){
		        		notify(response['data']['msg'], 'success');
		        		$('.login-html').empty();
		        		includeHTML("main-view");
		        		window.localStorage.setItem('unique_id', response['data']['token']);
		        		window.localStorage.setItem('user_id', response['data']['user_id']);
		        		loadUserChats();
		        	}
		        	else {
		        		notify(response['errors'], 'error');
		        	}
		          console.log(data)
		        },
		        error:function(data){
		          console.log(data);
		        }	
			});
		})

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
			$('.find-contact,.friend-chat').hide();
			$('.main-listings').show();
		})

		// open contact 
		$(document).on('click','.quick-act.wrt-msg', function(e){
			$('.main-listings').hide();
			$('.find-contact').show();
		})

		// open create group 
		$(document).on('click','.quick-act.create-group', function(e){
			$('.main-listings').hide();
			$('.create-group').show();
			getAllUsers();
		})

		$(document).on('keyup','input[name="search_friend"]', function(e){
			var str = $(this).val();
			if(str.length < 2) return false;
			$.ajax({
				url:serverUrl+"user/search",
				type:"POST",
				data:{str:str},
		        cache: false, 
		        crossDomain:true,
		        beforeSend:function(){
		          
		        },
		        success: function( data ) {
		        	response = JSON.parse(data)
		        	$html = '';
		        	if(response['isSuccess']){
		        		$.each(response['data'], function(i, val){
		        			$html += '<li data-id="'+val.id+'">'+
		    			'<a><img class="round r50" src="img/user_icon.jpg" /></a>'+
		    			'<span> '+val.name+'('+val.email+')</span></li>'
		        		});
		        	} else 
		        		$html += '<li>No Record Found</li>';

		        	$('.search-frnd-result').html($html);

		          console.log(data)
		        },
		        error:function(data){
		          console.log(data);
		        }	
			});
		})

		// open user chat
		$(document).on('click','.open-chat li', function(e){
			$('.chat-receiver a').find('span').html($(this).find('span').html());
			$('.chat-receiver a').attr('data-id',$(this).attr('data-id'));
			getChats($(this).attr('data-id'));
			$('.friend-chat').show();
			$('.find-contact, .main-listings').hide();

		})

		//write msg
		$(document).on('click','.msg-send', function(e){
			var msg_field = $(this).parents('.chat-window').find('textarea');
			var user_msg = msg_field.val();
			msg_field.val('');
			$.ajax({
				url:serverUrl+"message/send",
				type:"POST",
				data:{message:user_msg, uniqueId:window.localStorage.getItem('unique_id'), receiverId:$(this).parents('.friend-chat').find('a').attr('data-id')},
		        beforeSend:function(){
		          
		        },
		        success: function( data ) {

		        	data = JSON.parse(data);
		        	sendMessage(data['data'], 'sender');
		        }
			});
		})

		function loadUserChats(){
			$.ajax({
				url:serverUrl+"user/chats",
				type:"POST",
				data:{uniqueId:window.localStorage.getItem('unique_id')},
		        beforeSend:function(){
		        },
		        success: function( data ) {
		        	$html = "";
		        	response = JSON.parse(data);
		        	if(response['isSuccess']){
		        		$.each(response['data'], function(i, val){
		        			$html += '<li data-id="'+val.friend_id+'">'+
		    					'<a><img class="round r50" src="img/user_icon.jpg" /></a>'+
		    					'<span> '+val.friend+'</span><small> '+val.message.substring(0, 35)+'... </small></li>';
		        		});
		        		$('#chat').find('.chat-wrapper').html($html);
		        	}
		        }
			});
		}

		function getChats($friendId){
			$.ajax({
				url:serverUrl+"user/chats/"+$friendId,
				type:"POST",
				data:{uniqueId:window.localStorage.getItem('unique_id')},
		        beforeSend:function(){
		        },
		        success: function( data ) {
		        	$html = "";
		        	response = JSON.parse(data);
		        	if(response['isSuccess']){
		        		var position = "text-left";
		        		$.each(response['data'], function(i, val){
							var created_at = new Date(val.created_at);
							var chatDay = getWeekday(created_at.getDay());
		        			if(window.chatday != chatDay){
		        				window.chatday = chatDay;
		        				$html += '<li class="chat-date text-center"><a>'+window.chatday+'</a></li>';
		        			}
		        			if(val.sender_id == window.localStorage.getItem('user_id')){
		        				if(val.status == 1) 
		        					return ;
		        				position = "text-left";
		        			}
		        			else 
		        				position = "text-right"
		        			$html += '<li class="'+position+'" data-id="'+val.id+'"><a data-toggle="modal" data-target=".chat-msg-modal"> '+val.message+' <small>'+formatAMPM(created_at)+'</small></a></li>';
		        		});
		        		$('.friend-chat').find('.user-chat-wrap').append($html);
		        		// scroll to bottom
						$('#user-chat-wrap').scrollTop($('#user-chat-wrap')[0].scrollHeight);
		        	}
		        }
			});
		}

		function sendMessage(data, type){
			$html = '';
			switch(type){
				case 'sender':
					$html += '<li data-toggle="modal" data-target=".chat-msg-modal" class="text-left"><a>'+data['message']+'</a> <small>'+formatAMPM(new Date(data['created_at']))+'</small></li>';
				break;

				case 'receiver':
					$html += '<li data-toggle="modal" data-target=".chat-msg-modal" class="text-right"><a> '+data['message']+' <small>'+formatAMPM(new Date(data['created_at']))+'</small></a></li>';
				break;
			}
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

		function getAllUsers(){
			$.ajax({
				url:serverUrl+"users",
				type:"POST",
				data:{uniqueId:window.localStorage.getItem('unique_id')},
		        beforeSend:function(){
		        },
		        success: function( data ) {
		        	$html = "";
		        	response = JSON.parse(data);
		        	if(response['isSuccess']){
		        		$.each(response['data'], function(i, val){
		        			$html += '<li data-id="'+val.id+'">'+
		    					'<a><img class="round r50" src="img/user_icon.jpg" /> '+val.name+'</a>'+
		    					'<label class="checkbox-container"> <input type="checkbox" name="group_user_ids[]" value="'+val.id+'"> <span class="checkmark"></span> </label></li>';
		        		});
		        		$('.create-group').find('.all-users').html($html);
		        	}
		        }
			});
		}

		$(document).on('click','.all-users li', function(e){
			if ($(this).find('input').is(':checked'))
				$(this).find('input').prop('checked',false);
			else	
				$(this).find('input').prop('checked',true);
		})

		$(document).on('click','.create-group-now', function(e){
			var group_user_ids = $('input[name^=group_user_ids]').map(function(idx, elem) {
				if ($(elem).is(':checked'))
			    	return $(elem).val();
			}).get();

			var group_title = $('input[name="group_title"]').val();
			if(group_user_ids.length && group_title != ""){
				createGroup(group_title, group_user_ids);
			}
		})

		function createGroup(title, groupUserIds){
			$.ajax({
				url:serverUrl+"group/create",
				type:"POST",
				data:{uniqueId:window.localStorage.getItem('unique_id'), title:title, groupUsers:JSON.stringify(groupUserIds)},
		        beforeSend:function(){
		        },
		        success: function( data ) {
		        	$html = "";
		        	response = JSON.parse(data);
		        	if(response['isSuccess']){
		        		$.each(response['data'], function(i, val){
		        			$html += '<li data-id="'+val.id+'">'+
		    					'<a><img class="round r50" src="img/user_icon.jpg" /> '+val.name+'</a>'+
		    					'<label class="checkbox-container"> <input type="checkbox" name="group_user_ids[]" value="'+val.id+'"> <span class="checkmark"></span> </label></li>';
		        		});
		        		$('.create-group').find('.all-users').html($html);
		        	}
		        }
			});
		}

		$(document).on('show.bs.tab','a[data-toggle="tab"]', function (e) {
		    var target = $(e.target).attr("href");
		    console.log(target);
		    switch(target){
		    	case '#groups':
		    	 getUserGroups();
		    	 break;
		    }
		});

		function getUserGroups(){
			$.ajax({
				url:serverUrl+"group/getUserGroups",
				type:"POST",
				data:{uniqueId:window.localStorage.getItem('unique_id'), user_id:window.localStorage.getItem('user_id')},
		        beforeSend:function(){
		        },
		        success: function( data ) {
		        	$html = "";
		        	response = JSON.parse(data);
		        	if(response['isSuccess']){
		        		$.each(response['data'], function(i, val){
							var created_at = new Date(val.created_at);
		        			$html += '<li data-id="'+val.id+'">'+
		    					'<a><img class="round r50" src="img/group_icon.jpg" /></a> '+
		    					val.name+' <small class="pull-right">'+formatAMPM(created_at,'d M')+'</small></li>';
		        		});
		        		$('#groups').find('.group-wrapper').html($html);
		        	}
		        }
			});
		}

		$(document).on('show.bs.modal', '.chat-msg-modal', function(e){
			var li = $(e.relatedTarget).parents('li');
			$html = '<a onclick="chatMessage(\'remove\')" class="btn btn-sm form-control btn-warning">Remove from Device</a>'+
	  		'<a onclick="chatMessage(\'forward\')" class="btn btn-sm form-control btn-info">Forward Message</a>';
			if(li.attr('class') == 'text-right')
				$html += '<a onclick="chatMessage(\'report\')" class="btn btn-sm form-control btn-danger">Report Message</a>';
			else 
				$html += '<a onclick="chatMessage(\'edit\')" class="btn btn-sm form-control btn-success">Edit Message</a><a onclick="chatMessage(\'delete\')" class="btn btn-sm form-control btn-danger">Delete Completely</a>';
			$(this).find('.modal-wrapper').html($html);
			$(this).find('input[name="message_id"]').val(li.attr('data-id'));
		})

		function chatMessage(action){
			var message_id = $('.chat-msg-modal').find('input[name="message_id"]').val();
			switch(action){
				case 'remove': case 'delete':
				$.ajax({
					url:serverUrl+"message/remove",
					type:"POST",
					data:{uniqueId:window.localStorage.getItem('unique_id'), message_id:message_id, action:action},
			        beforeSend:function(){
			        },
			        success: function( data ) {
			        	$html = "";
			        	response = JSON.parse(data);
			        	if(response['isSuccess']){
			        		$('#user-chat-wrap').find('li[data-id="'+message_id+'"]').remove();
			        		$('.chat-msg-modal').modal('hide');
			        	}
			        }
				});	
			}
		}