var mainButton = document.getElementById("mainButton");
var originalNumberCont = document.getElementById("originalNumber");
var originalBaseCont = document.getElementById("originalBase");
var toBaseCont = document.getElementById("toBase");

var error = [document.getElementById("e1"), document.getElementById("e2"), document.getElementById("e3")];

var result = document.getElementById("result");

var dispbox
var errorCode;
var numCode = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#";

mainButton.addEventListener("click", convert);

function convert () {
	var from = originalNumberCont.value;
	var fromBase = Math.abs( Math.floor( Number(originalBaseCont.value) ) );
	var toBase = Math.abs( Math.floor( Number(toBaseCont.value) ) );

	clearErrors();

	if( check(from, toBase, fromBase) )
		startConversion(from, toBase, fromBase);
	else 
		showError("Conversion Failed", "console");
}


//Runs conversion, also converts to base 10 in case number isn't base 10
function startConversion (fromAny, toBase, fromBase) {
	var toIntPart = 0;
	var toFracPart = "";
	var finalNumber = "";
	var from = "";

	if(fromBase!=10)
		from = convertToBaseX(fromAny, fromBase);
	else
		from = fromAny;

	var integralPart = Math.floor(Number(from));
	var fractionalPart = Number("0." + from.split(".")[1]);
	
	toIntPart = convertInt(integralPart, toBase);

	if(!isNaN(fractionalPart))
		toFracPart = "." + convertFrac(fractionalPart, toBase);

	finalNumber = "" + toIntPart + toFracPart;

	show(finalNumber);
}

function convertToBaseX (from, base) {
	var num = 0;
	var numStr = ""
	var intg = from.split(".")[0];		// Integral Part
	var frac = from.split(".")[1];		// Fractional Part

	for( var rt = 0; rt < intg.length ; ++rt ){
		num = num + parseChar(intg[rt]) * Math.pow(base, (intg.length - rt - 1));
	}

	if(frac != undefined)
		for( var rt = 0; (rt < frac.length)&&(rt < 20) ; ++rt )
			num = num + parseChar(frac[rt]) * Math.pow(base, (-1*(rt+1) ));

	return num.toString();
}

function show (str) {
	result.innerHTML = str;
}

function clearErrors() {
	for(var i = 0; i<3; ++i)
		error[i].innerHTML = "";
}

function showError (str, id) {
	if(!id){
		id='input';
	}
	switch(id) {
		case 'input': error[0].innerHTML = str;
					  break;
	    case 'inputBase': error[1].innerHTML = str;
					  break;
		case 'convertTo': error[2].innerHTML = str;
					  break;
		case 'console': console.log(str);
						break;
		default: console.log('Warning: Invalid error message issued.');
					  break;
	}
	result.innerHTML = "Press convert!";
}

function parseNumber (num) {
	return numCode[num];
}

function parseChar (num) {
	return numCode.indexOf(num);
}

function check (str, cbase, base) {

	var flag = 0;

	if(str.length==0){
		showError("Input, please", "input");
		flag = 1;
	}

	if((base < 2)||(base > 64)){
		showError("Base should be in range 2 to 64, try a value within that range.\nImproper Base", "inputBase");
		flag = 1;
	}

	console.log(cbase);

	if((cbase < 2)||(cbase > 64)){
		showError("Base to be converted to should be in range 2 to 64, try a value within that range.\nImproper target Base", "convertTo");
		showError("Input, plAAAAease", "console");
		
		flag = 1;
	}

	var decimals = 0;
	for(var rt=0; rt < str.length; ++rt) {

		/*If not str[rt] is less than base or is a decimal
		  point then show a error.
		*/
		if( (parseChar(str[rt])>=base)   || (parseChar(str[rt])== -1) ) {	
			if(str[rt]=='.');
			else {
				showError("Check your number. Please.\nDigit too big for base at position " + (rt+1) +" of number", "input");
				flag = 1;
				break;
			}
		}


		/* Keep count of number of decimal points and show error
		   if number of points exceeds 1
		 */
		if(str[rt]=='.') ++decimals;
		if(decimals>1){
			showError("Too many decimals? Try reducing them.\nSecond decimal at position " + (rt+1) +" of number", "input");
			flag = 1;
			break;
		}
	}

	if( flag==1 ) {
		return false;
	}

	return true;
}

function convertInt (num, base) {
	var converted = "";
	while(num >= 1) {
		converted = parseNumber(num%base) + converted;
		num = Math.floor(num/base);
	}
	return converted;
}

function convertFrac (frac, base) {
	var converted = "", index = 0;
	while(frac!=0 && index < 20) {
		converted = converted + parseNumber(Math.floor(frac*base));
		frac = (frac * base) % 1;
		++index;
	}
	return converted;
}
