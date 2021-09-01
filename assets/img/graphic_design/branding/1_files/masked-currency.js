(function($){"use strict";if(!$.browser){$.browser={};$.browser.mozilla=/mozilla/.test(navigator.userAgent.toLowerCase())&&!/webkit/.test(navigator.userAgent.toLowerCase());$.browser.webkit=/webkit/.test(navigator.userAgent.toLowerCase());$.browser.opera=/opera/.test(navigator.userAgent.toLowerCase());$.browser.msie=/msie/.test(navigator.userAgent.toLowerCase());$.browser.device=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())}
var defaultOptions={prefix:"",suffix:"",affixesStay:!0,thousands:",",decimal:".",precision:2,allowZero:!1,allowNegative:!1,doubleClickSelection:!0,allowEmpty:!1,bringCaretAtEndOnFocus:!0},methods={destroy:function(){$(this).unbind(".maskMoney");if($.browser.msie){this.onpaste=null}
return this},applyMask:function(value){var $input=$(this);var settings=$input.data("settings");return maskValue(value,settings)},mask:function(value){return this.each(function(){var $this=$(this);if(typeof value==="number"){$this.val(value)}
return $this.trigger("mask")})},unmasked:function(){return this.map(function(){var value=($(this).val()||"0"),isNegative=value.indexOf("-")!==-1,decimalPart,settings=$(this).data("settings")||defaultOptions;if(settings.precision>0){$(value.split(/\D/).reverse()).each(function(index,element){if(element){decimalPart=element;return!1}});value=value.replace(/\D/g,"");value=value.replace(new RegExp(decimalPart+"$"),"."+decimalPart);if(isNegative){value="-"+value}}else{value=value.replace(/\D/g,"")}
return parseFloat(value)})},unmaskedWithOptions:function(){return this.map(function(){var value=($(this).val()||"0"),settings=$(this).data("settings")||defaultOptions,regExp=new RegExp((settings.thousandsForUnmasked||settings.thousands),"g");value=value.replace(regExp,"");return parseFloat(value)})},init:function(parameters){parameters=$.extend($.extend({},defaultOptions),parameters);return this.each(function(){var $input=$(this),settings,onFocusValue;settings=$.extend({},parameters);settings=$.extend(settings,$input.data());$input.data("settings",settings);function getInputSelection(){var el=$input.get(0),start=0,end=0,normalizedValue,range,textInputRange,len,endRange;if(typeof el.selectionStart==="number"&&typeof el.selectionEnd==="number"){start=el.selectionStart;end=el.selectionEnd}else{range=document.selection.createRange();if(range&&range.parentElement()===el){len=el.value.length;normalizedValue=el.value.replace(/\r\n/g,"\n");textInputRange=el.createTextRange();textInputRange.moveToBookmark(range.getBookmark());endRange=el.createTextRange();endRange.collapse(!1);if(textInputRange.compareEndPoints("StartToEnd",endRange)>-1){start=end=len}else{start=-textInputRange.moveStart("character",-len);start+=normalizedValue.slice(0,start).split("\n").length-1;if(textInputRange.compareEndPoints("EndToEnd",endRange)>-1){end=len}else{end=-textInputRange.moveEnd("character",-len);end+=normalizedValue.slice(0,end).split("\n").length-1}}}}
return{start:start,end:end}}
function canInputMoreNumbers(){var haventReachedMaxLength=!($input.val().length>=$input.attr("maxlength")&&$input.attr("maxlength")>=0),selection=getInputSelection(),start=selection.start,end=selection.end,haveNumberSelected=(selection.start!==selection.end&&$input.val().substring(start,end).match(/\d/))?!0:!1,startWithZero=($input.val().substring(0,1)==="0");return haventReachedMaxLength||haveNumberSelected||startWithZero}
function setCursorPosition(pos){if(settings.formatOnBlur){return}
$input.each(function(index,elem){if(elem.setSelectionRange){elem.focus();elem.setSelectionRange(pos,pos)}else if(elem.createTextRange){var range=elem.createTextRange();range.collapse(!0);range.moveEnd("character",pos);range.moveStart("character",pos);range.select()}})}
function maskAndPosition(startPos){var originalLen=$input.val().length,newLen;$input.val(maskValue($input.val(),settings));newLen=$input.val().length;if(!settings.reverse){startPos=startPos-(originalLen-newLen)}
setCursorPosition(startPos)}
function mask(){var value=$input.val();if(settings.allowEmpty&&value===""){return}
var decimalPointIndex=value.indexOf(settings.decimal);if(settings.precision>0){if(decimalPointIndex<0){value+=settings.decimal+new Array(settings.precision+1).join(0)}else{var integerPart=value.slice(0,decimalPointIndex),decimalPart=value.slice(decimalPointIndex+1);value=integerPart+settings.decimal+decimalPart+new Array((settings.precision+1)-(decimalPart.length-settings.format.length)).join(0)}}else if(decimalPointIndex>0){value=value.slice(0,decimalPointIndex)}
$input.val(maskValue(value,settings))}
function changeSign(){var inputValue=$input.val();if(settings.allowNegative){if(inputValue!==""&&inputValue.charAt(0)==="-"){return inputValue.replace("-","")}else{return"-"+inputValue}}else{return inputValue}}
function preventDefault(e){if(e.preventDefault){e.preventDefault()}else{e.returnValue=!1}}
function fixMobile(){if($.browser.device){$input.attr("type","tel")}}
function keypressEvent(e){e=e||window.event;var key=e.which||e.charCode||e.keyCode,decimalKeyCode=settings.decimal.charCodeAt(0);if(key===undefined){return!1}
if((key<48||key>57)&&(key!==decimalKeyCode||!settings.reverse)){return handleAllKeysExceptNumericalDigits(key,e)}else if(!canInputMoreNumbers()){return!1}else{if(key===decimalKeyCode&&shouldPreventDecimalKey()){return!1}
if(settings.formatOnBlur){return!0}
preventDefault(e);applyMask(e);return!1}}
function shouldPreventDecimalKey(){if(isAllTextSelected()){return!1}
return alreadyContainsDecimal()}
function isAllTextSelected(){var length=$input.val().length;var selection=getInputSelection();return selection.start===0&&selection.end===length}
function alreadyContainsDecimal(){return $input.val().indexOf(settings.decimal)>-1}
function applyMask(e){e=e||window.event;var key=e.which||e.charCode||e.keyCode,keyPressedChar="",selection,startPos,endPos,value;if(key>=48&&key<=57){keyPressedChar=String.fromCharCode(key)}
selection=getInputSelection();startPos=selection.start;endPos=selection.end;value=$input.val();$input.val(value.substring(0,startPos)+keyPressedChar+value.substring(endPos,value.length));maskAndPosition(startPos+1)}
function handleAllKeysExceptNumericalDigits(key,e){if(key===45){$input.val(changeSign());return!1}else if(key===43){$input.val($input.val().replace("-",""));return!1}else if(key===13||key===9){return!0}else if($.browser.mozilla&&(key===37||key===39)&&e.charCode===0){return!0}else{preventDefault(e);return!0}}
function keydownEvent(e){e=e||window.event;var key=e.which||e.charCode||e.keyCode,selection,startPos,endPos,value,lastNumber;if(key===undefined){return!1}
selection=getInputSelection();startPos=selection.start;endPos=selection.end;if(key===8||key===46||key===63272){preventDefault(e);value=$input.val();if(startPos===endPos){if(key===8){if(settings.suffix===""){startPos-=1}else{lastNumber=value.split("").reverse().join("").search(/\d/);startPos=value.length-lastNumber-1;endPos=startPos+1}}else{endPos+=1}}
$input.val(value.substring(0,startPos)+value.substring(endPos,value.length));maskAndPosition(startPos);return!1}else if(key===9){return!0}else{return!0}}
function focusEvent(){onFocusValue=$input.val();mask();var input=$input.get(0),textRange;if(settings.selectAllOnFocus){input.select()}else if(input.createTextRange&&settings.bringCaretAtEndOnFocus){textRange=input.createTextRange();textRange.collapse(!1);textRange.select()}}
function cutPasteEvent(){setTimeout(function(){mask()},0)}
function getDefaultMask(){var n=parseFloat("0")/Math.pow(10,settings.precision);return(n.toFixed(settings.precision)).replace(new RegExp("\\.","g"),settings.decimal)}
function blurEvent(e){if($.browser.msie){keypressEvent(e)}
if(!!settings.formatOnBlur&&$input.val()!==onFocusValue){applyMask(e)}
if($input.val()===""&&settings.allowEmpty){$input.val("").trigger('change')}else if($input.val()===""||$input.val()===setSymbol(getDefaultMask(),settings)){if(!settings.allowZero){$input.val("").trigger('change')}else if(!settings.affixesStay){$input.val(getDefaultMask())}else{$input.val(setSymbol(getDefaultMask(),settings))}}else{if(!settings.affixesStay){var newValue=$input.val().replace(settings.prefix,"").replace(settings.suffix,"");$input.val(newValue)}}
if($input.val()!==onFocusValue){$input.change()}}
function clickEvent(){var input=$input.get(0),length;if(settings.selectAllOnFocus){return}else if(input.setSelectionRange&&settings.bringCaretAtEndOnFocus){length=$input.val().length;input.setSelectionRange(length,length)}else{$input.val($input.val())}}
function doubleClickEvent(){var input=$input.get(0),start,length;if(input.setSelectionRange&&settings.bringCaretAtEndOnFocus){length=$input.val().length;start=settings.doubleClickSelection?0:length;input.setSelectionRange(start,length)}else{$input.val($input.val())}}
fixMobile();$input.unbind(".maskMoney");$input.bind("keypress.maskMoney",keypressEvent);$input.bind("keydown.maskMoney",keydownEvent);$input.bind("blur.maskMoney",blurEvent);$input.bind("focus.maskMoney",focusEvent);$input.bind("click.maskMoney",clickEvent);$input.bind("dblclick.maskMoney",doubleClickEvent);$input.bind("cut.maskMoney",cutPasteEvent);$input.bind("paste.maskMoney",cutPasteEvent);$input.bind("mask.maskMoney",mask)})}};function setSymbol(value,settings){var operator="";if(value.indexOf("-")>-1){value=value.replace("-","");operator="-"}
if(value.indexOf(settings.prefix)>-1){value=value.replace(settings.prefix,"")}
if(value.indexOf(settings.suffix)>-1){value=value.replace(settings.suffix,"")}
return operator+settings.prefix+value+settings.suffix}
function maskValue(value,settings){if(settings.allowEmpty&&value===""){return""}
if(settings.reverse){return maskValueReverse(value,settings)}
return maskValueStandard(value,settings)}
function maskValueStandard(value,settings){var negative=(value.indexOf("-")>-1&&settings.allowNegative)?"-":"",onlyNumbers=value.replace(/[^0-9]/g,""),integerPart=onlyNumbers.slice(0,onlyNumbers.length-settings.precision),newValue,decimalPart,leadingZeros;newValue=buildIntegerPart(integerPart,negative,settings);if(settings.precision>0){decimalPart=onlyNumbers.slice(onlyNumbers.length-settings.precision);leadingZeros=new Array((settings.precision+1)-decimalPart.length).join(0);newValue+=settings.decimal+leadingZeros+decimalPart}
return setSymbol(newValue,settings)}
function maskValueReverse(value,settings){var negative=(value.indexOf("-")>-1&&settings.allowNegative)?"-":"",valueWithoutSymbol=value.replace(settings.prefix,"").replace(settings.suffix,""),integerPart=valueWithoutSymbol.split(settings.decimal)[0],newValue,decimalPart="";if(integerPart===""){integerPart="0"}
newValue=buildIntegerPart(integerPart,negative,settings);if(settings.precision>0){var arr=valueWithoutSymbol.split(settings.decimal);if(arr.length>1){decimalPart=arr[1]}
newValue+=settings.decimal+decimalPart;var rounded=Number.parseFloat((integerPart+"."+decimalPart)).toFixed(settings.precision);var roundedDecimalPart=rounded.toString().split(settings.decimal)[1];newValue=newValue.split(settings.decimal)[0]+"."+roundedDecimalPart}
return setSymbol(newValue,settings)}
function buildIntegerPart(integerPart,negative,settings){integerPart=integerPart.replace(/^0*/g,"");integerPart=integerPart.replace(/\B(?=(\d{3})+(?!\d))/g,settings.thousands);if(integerPart===""){integerPart="0"}
return negative+integerPart}
$.fn.maskMoney=function(method){if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof method==="object"||!method){return methods.init.apply(this,arguments)}else{$.error("Method "+method+" does not exist on jQuery.maskMoney")}}})(window.jQuery||window.Zepto)