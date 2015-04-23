
var $ = jQuery;
var woo = $('#woo');
var content = $('#content');
$(document).ready(function($){
  // Start();
  var size = {
	  w: $(document).outerWidth(),
	  h: $(document).outerHeight()
	};
  var t = setTimeout(function(){
		$.ajax({
      url: 'http://woo.datsko.it/login?tmpl=raw&act=check',
      dataType: 'jsonp',
      complete: function(a,b,c){
        console.info(a.status);
        if(a.status==200){
          Load();
        }
        else{
          Error();
        }
      },
      error: Error()
    });
	},2000);
	$('.close').click(function(){
	  $(this).closest('.alert').remove();
	});
  // console.info(size);
	
	$('a:not(.close)').click(function(){
		var href = $(this).attr('href');
		$('.loader').show().css({'top':'-100%'}).animate({top:'0%'},2000,function(){
		  $('.page').hide();
		  window.location = href;
		});
		return false
	});
  //   if ($('*').hasClass('items')) {
  // 		//console.info('items');
  // 		DP.ItemDone();
  // 	}
});

function Load(){
  woo.show();
  woo.attr({
    src: 'http://woo.datsko.it'
  });
  woo.ready(function(){
    content.hide();
    // $('.loader').animate({top:'-100%'},2000,function(){
      $('.loader').hide();
    // });
  });
}
function Error(){
  
  woo.hide();
  content.show();
  $('.loader').animate({top:'-100%'},2000,function(){
    $('.loader').hide();
  });
}



var WOO = {};
WOO.Add = function(){
  jQuery.ajax({
    url: 'index.php',
    data: {
      option: 'com_ajax',
      module: 'woo',
      format: 'json',
      act: 'upload'
    },
    dataType: 'json'
  }).done(function(result){
    console.info(result);
    content.html(result.data);
  });
  
};



function Start(start){
  View('clients','own');
}

function Display(element,content){
  switch(element){
    case '123': {
      
      break;
    }
  }
  $(element).html(content).ready(function(){
    
    $('.btnhover .btn').hide();
    $('.btnhover').each(function(){
      var i = 5;
      $(this).find('.btn').each(function(){
        $(this).css({
          'position': 'absolute',
          'margin-left': i+'px'
        });
        i += 30;
      })
    });
    $('.btnhover').hover(function(){
      $(this).find('.btn').show().click(function(e){
        e.stopPropagation();
      });
    },function(){
      $(this).find('.btn').hide();
    });
  });
}
function Preload(el){
  $(el).html('<div class="preload"></div>');
}
function View(act,id){
  switch(act){
    case 'tasks': {
      if(!$('.tasks'+id).is(':empty')){
        $('.tasks'+id).html('');
      }
      else{
        Preload('.tasks'+id);
        $.ajax({
          url: 'index.php?option=com_dp&view=projectform&layout=actions&tmpl=raw',
          data: {
            act: 'tasks',
            id: id
          }
        }).done(function(result){
          result = JSON.parse(result);
          // console.info(result);
          Tasks(result.tasks,id);
        });
      }
      break;
    }
    case 'items': {
      if(!$('.items'+id).is(':empty')){
        $('.items'+id).html('');
      }
      else{
        Preload('.items'+id);
        $.ajax({
          url: 'index.php?option=com_dp&view=projectform&layout=actions&tmpl=raw',
          data: {
            act: 'items',
            id: id
          },
          type: 'POST',
          dataType: 'json'
        }).done(function(result){
          // result = JSON.parse(result);
          // console.info(result,id);
          Items(result.items,id);
        });
      }
      break;
    }
    case 'clients':{
      Preload('.projects-list');
      $.ajax({
        url: DP.actions,
        data: {
          act: 'clients',
          id: id
        },
        type: 'POST',
        dataType: 'json'
      }).done(function(result){
        // console.info(result);
        // result = JSON.parse(result);
        // console.info(result);
        Clients(result);
      });
      break;
    }
    case 'own':{
      var btn = $(id);
      $('.btn.projects-display').removeClass('active');
      btn.addClass('active');
      View('clients','own');
      break;
    }
    case 'archive':{
      var btn = $(id);
      $('.btn.projects-display').removeClass('active');
      btn.addClass('active');
      View('clients','archive');
      break;
    }
    case 'attached':{
      var btn = $(id);
      $('.btn.projects-display').removeClass('active');
      btn.addClass('active');
      View('clients','attached');
      break;
    }
  }
}
function Clients(result){
  var output = '';
  $.each(result.clients,function(i,client){
    output += Client(client);
    if(result.projects[client.id]){
      output += Projects(result.projects[client.id]);
    }
  });
  Display('.projects-list',output);
}
function Client(client){
  var output = '';
  var client_source = $("#client").html();
  var client_template = Handlebars.compile(client_source);
  var client_context = {
    name: client.name,
    edit: client.edit,
    id: client.id
  };
  var client_html = client_template(client_context);
  output += '<div class="client'+client.id+'">';
  output += client_html;
  output += '</div>';
  return output;
}
function Projects(projects){
  var output = '';
  $.each(projects,function(i,project){
    output += Project(project);
  });
  return output;
}
function Project(project){
  var output = '';
  var project_source = $("#project").html();
  var project_template = Handlebars.compile(project_source);
  var project_context = {};
  project_context.name = project.name;
  project_context.edit = project.edit;
  project_context.id = project.id;
  project_context.time = project.time;
  if(project.cost){
    project_context.cost = project.cost;
  }
  if(project.costin){
    project_context.costin = project.costin;
  }
  if(project.costinyear){
    project_context.costinyear = project.costinyear;
  }
  if(project.costinall){
    project_context.costinall = project.costinall;
  }
  if(project.costout){
    project_context.costout = project.costout;
  }
  
  var project_html = project_template(project_context);
  
  output += '<div class="project'+project.id+'">';
  output += project_html;
  output += '</div>';
  output += '<div class="tasks'+project.id+'"></div>';
  return output;
}
function Tasks(tasks,id){
  var output = '';
  $.map(tasks,function(task,i){
    output += Task(task);
  });
  Display('.tasks'+id,output);
}
function Task(task){
  var output = '';
  // console.info(task);
  var task_source = $("#task").html();
  var task_template = Handlebars.compile(task_source);
  var task_context = {
    name: task.name,
    edit: task.edit,
    id: task.id,
    pid: task.pid
  };
  task_context.status = task.status;
  task_context.time = task.time;
  if(task.cost){
    task_context.cost = task.cost;
  }
  if(task.costin){
    task_context.costin = task.costin;
  }
  if(task.costinyear){
    task_context.costinyear = task.costinyear;
  }
  if(task.costinall){
    task_context.costinall = task.costinall;
  }
  if(task.costout){
    task_context.costout = task.costout;
  }
  var task_html = task_template(task_context);
  
  output += '<div class="task'+task.id+'">';
  output += task_html;
  output += '</div>';
  output += '<div class="items'+task.id+'"></div>';
  return output;
}
function Items(items,id){
  var output = '';
  $.map(items,function(item,i){
    output += '<div class="item'+item.id+'">';
    output += Item(item);
    output += '</div>';
  });
  Display('.items'+id,output);
}
function Item(item){
  var output = '';
  // console.info(item);
  var output = '';
  var item_source = $("#item").html();
  var item_template = Handlebars.compile(item_source);
  var item_context = {
    name: item.name,
    edit: item.edit,
    id: item.id,
    pid: item.pid,
    sid: item.sid,
    time: item.time
  };
  var item_html = item_template(item_context);
  
  // output += '<div class="item'+item.id+'">';
  output += item_html;
  // console.info(item_html);
  // output += '</div>';
  return output;
}
Handlebars.registerHelper('client', function(options) {
  console.info(options,options.fn(this));
  var client = options.fn(this);
  client = client.split('|');
  var client_source = $("#client").html();
  var client_template = Handlebars.compile(client_source);
  var client_context = {name: client[0],edit: client[1],projects: 'projects'};
  var client_html = client_template(client_context);
  return client_html;
});
Handlebars.registerHelper('project', function(options) {
  console.info(options,options.fn(this));
  // var project = options.fn(this);
  // project = project.split('|');
  // var project_source = $("#project").html();
  // var project_template = Handlebars.compile(project_source);
  // var project_context = {name: project[0],edit: project[1]};
  // var project_html = project_template(project_context);
  return 'project_html';
});

var DP = {
	actions:'/index.php?option=com_dp&view=projectform&layout=actions&tmpl=raw',
	Modal:function(url,params,element){
		// console.log(url,params);
		// SqueezeBox.initialize();
		// SqueezeBox.close();
		// SqueezeBox.open(url,params);
		// console.info($(document).scrollTop());
		var box = $('<div />');
		var content = $('<div />');
		var over = $('<div />');
		var close = $('<span />');
		var closein = $('<span />');
		box.addClass('dp-box');
		over.addClass('dp-over');
		close.addClass('dp-close btn btn-default');
		closein.addClass('icon-cancel-3');
		content.addClass('dp-content');
		close.click(function(){
		  box.remove();
		  over.remove();
		});
		content.html(DP.Preload());
		close.append(closein);
		box.append(close);
		box.append(content);
		box.css({
		  top: $(document).scrollTop()+40+'px'
		});
		$('body').append(over);
		$('body').append(box);
		$.ajax({
		  url: url,
		  type: 'POST'
		}).done(function(result){
		  content.html(result);
		});
	},
	ModalClose: function(){
	  $('.dp-box').remove();
		$('.dp-over').remove();
	},
	Preload: function(){
    return '<div class="preload"></div>';
  },
	Additional:function(block,url,id){
		$.ajax(url+'&additional=1').done(function(data){
			$(block).append('<div class="additional"><button type="button" class="close">×</button>'+data+'</div>');
			$('.additional .close').click(function(){
				$(this).parent().remove();
			});
		});
	},
	SO:function(f){
		var o = {};
		var a = f.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	},
	Message:function(type,text){
		$('body').append('<div class="alert alert-'+type+' p-f-t-r">'+text+'</div>');
		var t = setTimeout(function(){$('.p-f-t-r').remove();},3000);
	},
	Reload:function(act2,id,fdata){
		var url = '/index.php?option=com_dp&tmpl=raw';
		var block = '#content';
		// console.log(fdata);
		switch(act2){
			case'item':{
				url += '&view=task&id='+id+'&pid='+fdata.pid;
				block = '.items'+fdata.tid;
				fdata.id = fdata.tid;
				DP.View('item',fdata);
				
				return false
				break;
			}
			case'task':{
				url += '&view=tasks&id='+id;
				break;
			}
			case'project':{
				url += '&view=projects';
				break;
			}
			case'finance':{
				url += '&view=finance';
				break;
			}
			case'client':{
				if(fdata.additional){
					url = 'index.php?option=com_dp&view=projectform&tmpl=raw&act2=project&id=0';
					block = '#sbox-content';
				}
				else{
					url += '&view=clients';
				}
				break;
			}
			case'kit':{
				url += '&view=kit';
				break;
			}
			case'kitpage':{
				url += '&view=kitpage';
				break;
			}
		}
		// console.log(url);
		$.ajax({
			type: "POST",
			url:url
		}).done(function(data){
			// console.log(data);
			$(block).html(data);
			// if(data){
				// f[0].reset();
				// DP.Message('success','Удалено');
				// DP.Reload(act2,id);
			// }
		});
		
	},
	Delete:function(act2,id){
		// console.info('Delete');
		if(confirm('Delete?')){
			$.ajax({
				type: "POST",
				url: DP.actions,
				data:{
				  act: 'delete',
				  act2: act2,
				  id: id
				},
				dataType: 'json'
			}).done(function(data){
				console.log(data);
				
				// if(data){
					// f[0].reset();
				DP.Message('success','<span class="icon-ok"></span>');
				switch(act2){
  			  case 'client':{
  			    DP.ModalClose();
            View('clients');
  			    break;
  			  }
  			  case 'project':{
  			    DP.ModalClose();
            View('clients');
  			    break;
  			  }
  			  case 'task':{
  			    DP.ModalClose();
            View('clients');
  			    break;
  			  }
  			  case 'item':{
  			    DP.ModalClose();
  			    var tid = $('.item'+id).parent().attr('class');
  			    tid = parseInt(tid.replace('items',''));
  			    $('.items'+tid).html('');
  			    View('items',tid);
  			    break;
  			  }
  			  default:{
  			    DP.ModalClose();
  			    break;
  			  }
  			}
				// DP.Reload(act2,id,data);
				// }
			});
		}
	},
	Add:function(f){
		var fdata = DP.SO($(f));
		if( Object.prototype.toString.call( fdata.pid ) === '[object Array]' ) {
      fdata.pid = fdata.pid[0];
    }
		$.ajax({
			url:DP.actions,
			data:fdata
		}).done(function(data){
			switch(fdata.act2){
			  case 'client':{
			    if(fdata.act=='add'){
  			    $.ajax({
  			      url: DP.actions,
  			      dataType: 'json',
  			      data: {
  			        act: 'select',
  			        act2: 'clients'
  			      }
  			    }).done(function(result){
  			      var options = '';
  			      $.map(result,function(c,i){
  			        options += '<option value="'+c.id+'">'+c.name+'</option>';
  			      });
  			      $('#cidblock select[name=cid]').html(options);
  			      $(f).closest('.additional').remove();
  			    });
			    }
			    else if(fdata.act=='edit'){
			      DP.ModalClose();
            View('clients');
			    }
			    break;
			  }
			  case 'project':{
			    DP.ModalClose();
          View('clients');
			    break;
			  }
			  case 'task':{
			    DP.ModalClose();
          View('clients');
			    break;
			  }
			  case 'item':{
			    DP.ModalClose();
			    if(!$('.items'+fdata.tid).is(':empty')){
  			    $('.items'+fdata.tid).html('');
  			    View('items',fdata.tid);
			    }
			    break;
			  }
			  default:{
			    DP.ModalClose();
			    break;
			  }
			}
			
  		// 	f.reset();
  		// 	DP.Message('success',(f.act.value=='edit'?'<span class="icon-save"></span>':'<span class="icon-ok"></span>'));
  		// 	DP.Reload(f.act2.value,data,fdata);
  		// 	if(f.act2.value=='client'&&fdata.additional){
  				
  		// 	}
  		// 	else{
  		// 		SqueezeBox.close();
  		// 	}
		});
	},
	View:function(act,data){
	  switch(act){
	    case 'item':{
	      $.ajax({
	        url:'index.php?option=com_dp&view=task&pid='+data.pid+'&id='+data.id+'&tmpl=raw'
	      }).done(function(result){
	        result = '<span class="icon-delete" onclick="$(\'.items'+data.id+'\').html(\'\')" style="font-size: 12px;float: right;cursor: pointer;"></span>'+result;
	        $('.items'+data.id).html(result);
	      });
	      break;
	    }
	  }
	},
	Item:function(act2,id){
		$.ajax({
			type: "POST",
			url:DP.actions,
			data:{act:'item',act2:act2,id:id},
			dataType: 'json'
		}).done(function(result){
		  
			// f.reset();
		  // 	console.log(data);
		  // 	data = JSON.parse(data);
		  // console.log(data);
			var message = '';
			switch(act2){
				case'play':{
					message = '<span class="icon-play"></span>';
					break;
				}
				case'pause':{
					message = '<span class="icon-pause"></span>';
					break;
				}
				case'stop':{
					message = '<span class="icon-stop"></span>';
					break;
				}
			}
			DP.Message('success',message);
		  // 	DP.Reload('item',id,data);
		  // Item(result);
		  
		  Display('.item'+result.id,Item(result));
			// SqueezeBox.close();
		});
	},
	ItemDone:function(){
		console.info('Init ItemDone');
		
	},
	Download:{
		HTML:function(site,id){
			$.ajax('/index.php?option=com_dp&view=projectform&layout=actions&tmpl=ajax&id='+id+'&act=downloadhtml')
				.done(function(data){
					var url = site+'tmp/site'+DP.B64.encode(id).replace(/=/g,'')+'.zip';
					console.log(url);
					var a = '<a href="'+url+'" id="sitedownload" target="_blank" onclick="$(this).remove()"><span class="icon-download"></span> Скачать</a>';
					$('body').append(a);
				});
		},
		Joomla:function(){
			$.ajax('/index.php?option=com_dp&view=projectform&layout=actions&tmpl=ajax&id='+id+'&act=downloadjoomla')
				.done(function(data){
					var url = site+'tmp/sitej'+DP.B64.encode(id).replace(/=/g,'')+'.zip';
					console.log(url);
					var a = '<a href="'+url+'" id="sitedownload" target="_blank" onclick="$(this).remove()"><span class="icon-download"></span> Скачать</a>';
					$('body').append(a);
				});
		}
	},
	B64:{
		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		encode : function (input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
			input = DP.B64._utf8_encode(input);
			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
			}
			return output;
		},
		decode : function (input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (i < input.length) {
				enc1 = this._keyStr.indexOf(input.charAt(i++));
				enc2 = this._keyStr.indexOf(input.charAt(i++));
				enc3 = this._keyStr.indexOf(input.charAt(i++));
				enc4 = this._keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
			}
			output = DP.B64._utf8_decode(output);
			return output;
		},
		_utf8_encode : function (string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}
			return utftext;
		},
		_utf8_decode : function (utftext) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;
			while ( i < utftext.length ) {
				c = utftext.charCodeAt(i);
				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				}
				else if((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i+1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				}
				else {
					c2 = utftext.charCodeAt(i+1);
					c3 = utftext.charCodeAt(i+2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;
		}
	}
}

$(function($) {
  $.fn.DatskoBox = function() {
    var item = this;
    this.unbind('click');
    this.click(function() {
      var href = item.prop('href');
      var options = {
        height: 300,
        width: 400,
        iframe: false,
        top: item.offset().top < 120 ? 20 : item.offset().top - 100,
        type: 'html'
      };
      event.preventDefault();
      options.top = $(window).scrollTop() + 20;
      //console.info($(window).scrollTop());
      if (typeof item.data('options') != 'undefined') {
        //console.info(item.data('options'));
        var tmp = item.data('options');
        var tmp2 = [];
        var itemoptions = {};
        tmp = tmp.split(',');
        for (var i = 0; i < tmp.length; i++) {
          tmp2 = tmp[i].split(':');
          itemoptions[tmp2[0]] = tmp2[1];
        }
        for (var option in itemoptions) {
          options[option] = itemoptions[option];
        }
        //console.info(options);
      }
      var txt = {
        loading: 'Loading'
      };
      var win = '<div id="dbox-container" style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;z-index: 1000000;">' +
        '<div id="dbox-overlay" style="position: fixed;left: 0;top: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.4);" onclick="$(this).parent().remove();"></div>' +
        '<div id="dbox-wrapper">' +
        '<div id="dbox-title">' +
        '<div id="dbox-title-inner"></div>' +
        '</div>' +
        '<div id="dbox-wrapper-inner" style="display: block;width:' + options.width + 'px;margin: 0 auto;background: #fff;z-index: 1;position: relative;padding: 30px;top: ' + options.top + 'px;">' +
        '<a id="dbox-nav-close" title="" onclick="$(this).parent().parent().parent().remove();" style="display: block;position: absolute;right: 0;top: 0;width: 30px;height: 30px;background: #55C95D;font-size: 16px;text-align: center;line-height: 30px;color: #fff;cursor: pointer;z-index: 9;">&#10005</a>' +
        '<div id="dbox-body">' +
        '<div id="dbox-body-inner" style="display: block;height:' + options.height + 'px;">{content}</div>' +
        '<div id="dbox-loading">' +
        '<div id="dbox-loading-inner">' +
        '<span></span>' +
        '</div>' +
        '</div>' +
        '<div id="dbox-info">' +
        '<div id="dbox-info-inner">' +
        '<div id="dbox-counter"></div>' +
        '<div id="dbox-nav">' +
        '<a id="dbox-nav-next" title="{next}" onclick="Shadowbox.next()"></a>' +
        '<a id="dbox-nav-play" title="{play}" onclick="Shadowbox.play()"></a>' +
        '<a id="dbox-nav-pause" title="{pause}" onclick="Shadowbox.pause()"></a>' +
        '<a id="dbox-nav-previous" title="{previous}" onclick="Shadowbox.previous()"></a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
      switch (options.type) {
        case 'iframe':
          win = win.replace('{content}', '<iframe src="' + href + '" style="border:0;width:100%;height:100%;"></iframe>');
          $('body').append(win);
          break;
        default:
          $.ajax(href).done(function(data) {
            //console.info(data);
            win = win.replace('{content}', data);
            $('body').append(win);
          });
          break;
      }
      return false
    });
  };
  $.fn.DatskoSlider = function(sets) {
    if(sets.orientation=="vertical"){
      console.info('Init DatskoSlider');
      console.info(sets.value);
      var item = this;
      // console.info(item.width(),item.height());
      var min = item.height()-12;
      var max = 0;
      console.info(sets.value,sets.min,sets.max,min,max);
      var sl = $('.ds-slider');
      var hl = $('.ds-handler');
      // sl.addClass('ds-slider');
      // hl.addClass('ds-handler');
      hl.css({
        'top':min+'px'
      });
      hl.draggable({
        containment: 'parent',
        scroll: false,
        drag: function(event,ui){
          // console.info(ui.position.top);
          var v = sets.max-ui.position.top*(sets.max-sets.min)/(min-max);
          $('svg.villmap').find('g').attr('transform','scale('+v+')');
          MAP.Zoom({act:'refresh',ratio:v,svg:'svg.villmap',handler:true});
          console.info(v);
        },
        grid: [100,1]
      });
      // sl.append(hl);
      // item.append(sl);
    }
  };
  $('[rel=dbox]').each(function() {
    $(this).DatskoBox();
  });
  //$(document).on("click", '[rel=dbox]', function(event) {
  //	event.preventDefault();
  //	$(this).DatskoBox();
  //});
});

