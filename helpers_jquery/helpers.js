(function($){
	
	var gridjs = function(){
		$('.two-columns > .column, .two-columns > .container > .column').css({
			width : '50%'
		});
		
		$('.column,'
		+ '.two-columns > .fixed-left-column,'
		+ '.two-columns > .container > .fixed-left-column,'
		+ '.three-columns > .elastic-left-column,'
		+ '.three-columns > .container > .elastic-left-column').css({
			float : 'left'
		});
		
		$('.two-columns > .fixed-right-column,'
		+ '.two-columns > .container > .fixed-right-column,'
		+ '.three-columns > .elastic-right-column,'
		+ '.three-columns > .container > .elastic-right-column').css({
			float : 'right'
		});
		
		$('.three-columns > .column, .three-columns > .container > .column').css({
			width : '33.33%'
		});
		
		$('.three-columns > .fixed-center-column,'
		+ '.three-columns > .container > .fixed-center-column').css({
			margin : 'auto'
		});
		
		$('.three-columns > .span-2,'
		+ '.three-columns > .container > .span-2').css({
			width : '66.66%'
		});
		
		$('.four-columns > .column,'
		+ '.four-columns > .container > .column').css({
			width : '25%'
		});
		
		$('.four-columns > .span-2,'
		+ '.four-columns > .container > .span-2').css({
			width : '50%'
		});
		
		$('.four-columns > .span-3,'
		+ '.four-columns > .container > .span-3').css({
			width : '75%'
		});
	};
	
	var elastic = function(){
		var getElasticElements = function(){
			var expression     = /(^|\s)(two\-columns|three\-columns|four\-columns|auto\-columns)($|\s)/
			var elements       = document.getElementsByTagName('*');
			var elementsLength = elements.length;
			var foundElements  = new Object(HTMLCollection);
			var counter = 0;
			var currentElement;

			for(var i = 0; i < elementsLength; i++){
				currentElement = elements[i];
				if(expression.test(currentElement.className)){
					foundElements[counter++] = currentElement;
				}
			}

			foundElements.item      = function(){};
			foundElements.namedItem = function(){};
			foundElements.length    = counter;

			return foundElements;
		};
		
		$.each(getElasticElements(), function(){
			var element = $(this);
			var foundColumns = $('> .column, > .container > .column,'
			              + '> .fixed-column, > .container > .fixed-column,' 
			              + '> .fixed-left-column, > .container > .fixed-left-column,'
			              + '> .fixed-right-column, > .container > .fixed-right-column,'
			              + '> .elastic-column, > .container > .elastic-column,'
			              + '> .fixed-center-column, > .container > .fixed-center-column,'
			              + '> .elastic-left-column, > .container > .elastic-right-column,'
			              + '> .elastic-right-column, > .container > .elastic-right-column,', this);
			
			if(element.hasClass('two-columns')){
				var maxMembers = 2;
			}
			if(element.hasClass('three-columns')){
				var maxMembers = 3;
			}
			if(element.hasClass('four-columns')){
				var maxMembers = 4;
			}
			if(element.hasClass('auto-columns')){
				var maxMembers = foundColumns.size();
			}
			
			var columnGroups       = [];
			var columnGroup        = [];
			var counts             = 0;
			var counted            = 0;
			var nextValueOfCounted = 0;
			
			// determination of groups
			foundColumns.each(function(){
				var reg = /(^|\s+)span\-(\d+)(\s+|$)/;
				reg.test($(this).attr('className'));
				if(RegExp.$2 > 0)
				{
					counts = RegExp.$2;
				}
				else
				{
					counts = 1;
				}
				
				nextValueOfCounted = counted + counts;
				
				if(nextValueOfCounted < maxMembers)
				{
					columnGroup.push(this);
					counted = nextValueOfCounted;
					return;
				}
				
				if(nextValueOfCounted == maxMembers)
				{
					columnGroup.push(this);
					columnGroups.push( [].concat(columnGroup) )
					columnGroup = [];
					counted = 0;
					return;	
				}
				
				if(nextValueOfCounted > maxMembers)
				{
					columnGroups.push( [].concat(columnGroup) )
					columnGroup = [this];					
					counted = counts;
					return;	
				}
			});
			
			// determination of sizes
			$.each(columnGroups, function(){
				var elasticColumns = [];
				var fixedColumns   = [];
				var columns        = [];
				var unitarySize    = Math.round(element.width() / maxMembers);
				
				$.each(this, function(){
					var classes = $(this).attr('className');
					if(/(fixed)/.test(classes)){
						fixedColumns.push(this);
					}
					else if(/(elastic)/.test(classes)){
						elastic.push(this);
					}
					else
					{
						columns.push(this);
					}
				});
				
				var totalWidth  = 0;
				var columnsWidth = 0;
				var fixedColumnsWidth = 0;
				var elasticColumnsWidth = 0;
				
				if(fixed-columns.length > 0)
				{
					$.each(function(){
						$(this).css('width', Math.round( $(this).width() ) );
						fixedColumnsWidth += $(this).width();
					});
				}
				
				if(columns.length > 0){
					$.each(columns, function(){
						var counts = 0;
						
						var reg = /(^|\s+)span\-(\d+)(\s+|$)/;
						reg.test($(this).attr('className'));
						if(RegExp.$2 > 0)
						{
							counts = RegExp.$2;
						}
						else
						{
							counts = 1;
						}
						
						if (this !== columns[ columns.length - 1 ]){
							$(this).css('width', unitarySize * counts);
							columnsWidth += (unitarySize * counts);
						}
						else if ( elasticColumns.length == 0 )
						{
							$(this).css('width', unitarySize * counts);
							columnsWidth += (unitarySize * counts);
						}
						else
						{
							$(this).css('width', ( element.width() - ( ( unitarySize * columnsWidth ) + fixedColumnsWidth ) ) );
						}
					});
				}
				
				if(elasticColumns.length > 0){
					$.each(elasticColumns, function(){
						if(this !== elasticColumns[elasticColumns.length - 1 ]){
							$(this).css('width', Math.round( element.width() - ( ( columnsWidth + fixedColumnsWidth ) / elasticColumns.length ) ) );
							elasticColumnsWidth += $(this).width();
						}
						else
						{
							$(this).css('width', ( element.width() - ( ( unitarySize * columnsWidth ) + fixedColumnsWidth + elasticColumnsWidth ) ) );
						}
					});
				}
			});
		});
		
		$('.fixed-left-column').each(function(){
			$('> .elastic-column', this.parentNode).css('width', $(this.parentNode).width() - $(this).width());
		});
		
		$('.fixed-right-column').each(function(){
			$('> .elastic-column', this.parentNode).css('width', $(this.parentNode).width() - $(this).width());
		});
		
		$('.two-columns > .fixed-column, .two-columns > .container > .fixed-column').each(function(){
			$('> .elastic-column', this.parentNode).css('width', $(this.parentNode).width() - $(this).width());
		});
		
		$('.fixed-center-column').each(function(){
			$('> .elastic-left-column, > .elastic-right-column', this.parentNode).css('width', $(this.parentNode).width() / 2 - $(this).width() / 2 );
		});
		
		if($.browser.msie){
			if($.browser.version < 7){
				gridjs();
			}
			
			$('.two-columns > .column, .two-columns > .container > .column').each(function(){
				$(this).css({
					width : Math.floor( $(this.parentNode).width() / 2 )
				});
			});
			
			$('.three-columns > .column, .three-columns > .container > .column').each(function(){
				if( $(this).hasClass('span-2') ){
					$(this).css({
						width : Math.floor($(this.parentNode).width() * 0.66 )
					});
				}
				else{
					$(this).css({
						width : Math.floor( $(this.parentNode).width() / 3 )
					});
				}
			});
			
			$('.four-columns > .column, .four-columns > .container > .column').each(function(){
				
				if( $(this).hasClass('span-2') ){
					$(this).css({
						width : Math.floor($(this.parentNode).width() * 0.5 )
					});
				}
				else if( $(this).hasClass('span-3') ){
					$(this).css({
						width : Math.floor($(this.parentNode).width() * 0.75 )
					});
				}
				else{
					$(this).css({
						width : Math.floor($(this.parentNode).width() * 0.25 )
					});
				}
			});
			
			$('.auto-columns').each(function(){
				var columns = $('> .column, > .container > .column', this);
				var columnsSize = columns.size();
				columns.each(function(){
					$(this).css({
						width : Math.floor( $(this.parentNode).width() / columnsSize )
					});
				});
			});
		}
		else{
			$('.auto-columns').each(function(){
				var columns = $('> .column, > .container > .column', this);
				var columnsSize = columns.size();
				columns.each(function(){
					$(this).css({
						width : (100 / columnsSize) + '%' 
					});
				});
			});
		}
		
		$('.full-width').each(function(){
			$(this).width( $(this.parentNode).width() - ( $(this).outerWidth(true) - $(this).width() ) );
		});
		
		$('.same-height').each(function(){
			var height = $(this).outerHeight(true) - ( $(this).outerHeight(true) - $(this).height() );
			$('> *', this).each(function(){
				$(this).css('height', height);
			});
		});
		
		$('.equalized-height').each(function(){
			var columns = $('> .column, > .container > .column', this);
			var maxHeight = 0;
			columns.each(function(){
				var currentHeight = $(this).outerHeight(true);
				maxHeight = (maxHeight > currentHeight) ? maxHeight : currentHeight;
			})
			.each(function(){
				$(this).css('height', maxHeight)
			});
		});
		
		$('.full-height').each(function(){
			$(this).css('height', $(this.parentNode).height() - ( $(this).outerHeight(true) - $(this).height() ));
		});
		
		$('.vertical-center, .center').each(function(){
			var paddingTop = ( ( $(this.parentNode).height() - $(this).outerHeight(true) ) / 2 );
			$(this.parentNode).css({
				paddingTop : paddingTop + 'px',
				height     : ( $(this.parentNode).css('height') ) ? ( $(this.parentNode).outerHeight() - paddingTop ) : ''
			});
		});
	};
	
	var elastic_refesh = function(){
		$('.same-height > .column, .same-height > .container > .column, .full-height, .equalized-height').css('height', '');
		$('.vertical-center, .center').each(function(){
			$(this.parentNode).css('padding-top', '');
		});
		$('.auto-columns > .column, .auto-columns > .container > .column, .full-width, .elastic-column, .elastic-left-column, elastic-right-column').css('width', '');
		elastic();
	}
	
	$(function(){
		elastic();
		$(document).bind('elastic', elastic_refesh);
		$(window).bind('resize', elastic_refesh);
		
		if(!$.browser.msie){
			$(window).bind('load', elastic_refesh)
		}
	});
})(jQuery);
