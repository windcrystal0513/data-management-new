// 代码整理：懒人之家 lanrenzhijia.com
<!--
$(document).ready(function() {

	/* 
	------------------------------------------------------------------------------------------------------------------------------------
	Tutorial #1: How to create a simple Bubble Popup!
	------------------------------------------------------------------------------------------------------------------------------------*/
	
	// The following code creates a simple Bubble Popup opening when mouse is over on the element with ID '#dummy1'.
	$('#dummy1').SetBubblePopup({
									innerHtml: '<p>You can set any HTML tag<br />inside this popup!<br /><a href="#">this is a link</a></p>'
								});

	/* 
	------------------------------------------------------------------------------------------------------------------------------------
	Tutorial #2: How to create Bubble Popups with custom styles!
	------------------------------------------------------------------------------------------------------------------------------------*/
	
	// We define a custom style and message for the Bubble Popup on '#dummy2' element...
	$('#dummy2').SetBubblePopup({
									innerHtml: '<p>Bubble Popup!</p>', 
									bubbleAlign: 'left',
									tailAlign: 'left',
									color: 'green',
									contentStyle: 'font-size:16px;'
								});

	//Then, we define a common style both for elements with class '.myclass' and rel attribute 'nofollow';
	//Note: we call the "SetBubblePopup()" method from "jQuery" object to select more elements at time.
	jQuery().SetBubblePopup({
									cssClass: [ ".myclass" ],
									relAttribute: [ "nofollow" ],

									innerHtml: '<p>another Bubble Popup!</p>', 
									bubbleAlign: 'right',
									tailAlign: 'right',
									color: 'violet',
									contentStyle: 'color:#CC0066; font-family:Arial; font-size:11px; font-weight:bold;'
								});

	/* 
	------------------------------------------------------------------------------------------------------------------------------------
	Tutorial #3: How to create Bubble Popups with custom events!
	------------------------------------------------------------------------------------------------------------------------------------
	
	This code creates a Bubble Popup for each element and attach to it a default HTML message.
	Besides, it disables "showOnMouseOver" event for all Bubble Popups, 
	because we will implement own custom events and messages for each element!
	*/
	
	jQuery().SetBubblePopup({ 
								tagID:['#dummy3', '#dummy4'], 
								innerHtml: '<p>This is the default message<br />for all Bubble Popups!</p>',
								showOnMouseOver: false
							});

	// Show Bubble Popup on mouse over'#dummy3' and hide it on mouse out;
	// Bubble Popup will display the default HTML message.
	$('#dummy3').mouseover(function(){
										$('#dummy3').ShowBubblePopup();
									});
	$('#dummy3').mouseout(function(){ 
										$('#dummy3').HideBubblePopup(); 
									});

	// Show Bubble Popup only on click '#dummy4' and hide it on mouse out;
	// however, Bubble Popup will display a custom HTML message.
	$('#dummy4').click(function(){
									$('#dummy4').ShowBubblePopup({ innerHtml: "This is a custom text!" });
									return false;
								});
	$('#dummy4').mouseout(function(){ 
										$('#dummy4').HideBubblePopup(); 
									});

	/* 
	------------------------------------------------------------------------------------------------------------------------------------
	Tutorial #4: Control Bubble Popups events externally.
	------------------------------------------------------------------------------------------------------------------------------------*/

	//Set a Bubble Popup with events controlled inside the HTML tag.
	$('#dummy5').SetBubblePopup({ 
									innerHtml: '<p>Bubble Popup!</p>',
									showOnMouseOver: false
								});

});
//-->

/* 代码整理：懒人之家 lanrenzhijia.com */