var mainButton = document.getElementById("mainButton");
var originalNumberCont = document.getElementById("originalNumber");
var toCode = document.getElementById("convertTo");
var errorCode;

var error = [document.getElementById("e1"), document.getElementById("e2"), document.getElementById("e3")];

var result = document.getElementById("result");

var base10     = "0123456789"
var _bcd       = ["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001"];
var _5421      = ["0000", "0001", "0010", "0011", "0100", "1000", "1001", "1010", "1011", "1100"];
var _4221      = ["0000", "0001", "0010", "0011", "1000", "0111", "1100", "1101", "1110", "1111"];
var _2421      = ["0000", "0001", "0010", "0011", "0100", "1011", "1100", "1101", "1110", "1111"];
var _84n2n1    = ["0000", "0111", "0110", "0101", "0100", "1011", "1010", "1001", "1000", "1111"]
var _biquinary = ["0100001", "0100010", "0100100", "0101000", "0110000", "1000001", "1000010", "1000100", "1001000", "1010000"]

mainButton.addEventListener("click", convert);

function show (str) {
	result.innerHTML = str;
}

function clearErrors() {
		error[0].innerHTML = "";
}

function showError (str, id) {
	if(!id){
		id='input';
	}
	switch(id) {
		case 'input': error[0].innerHTML = str;
					  break;
		case 'console': console.log(str);
						break;
		default: console.log('Warning: Invalid error message issued.');
					  break;
	}
	result.innerHTML = "Press convert!";
}

function convert () {
	var num = originalNumber.value;
	var code = toCode.value;

	clearErrors();

	if(!check(num, 10)){
		console.log("BASE ERROR QUIT");
		return -1;
	}

	switch(code) {
		case "bcd": show(toBCD(num, _bcd));
					break;
		case "5421": show(toBCD(num, _5421));
					 break;
		case "4221": show(toBCD(num, _4221));
					 break;
		case "2421": show(toBCD(num, _2421));
					 break;
		case "84n2n1": show(toBCD(num, _84n2n1));
					 break;
		case "biquinary": show(toBCD(num, _biquinary));
					 break;
		default : showError("Something went horrendously wrong", "input");
	}
}

function parseChar (num) {
	return base10.indexOf(num);
}

function check (str, base) {

	var flag = 0;

	if(str.length==0){
		showError("Input, please", "input");
		flag = 1;
	}

	if((base < 2)||(base > 64)){
		showError("Something went horrendously wrong, try again", "input");
		flag = 1;
	}

	var decimals = 0;
	for(var rt=0; rt < str.length; ++rt) {

		/*If not str[rt] is less than base or is a decimal
		  point then show a error.
		*/
		if( (parseChar(str[rt])>base)   || (parseChar(str[rt])== -1) ) {	
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

function parseChar (chr) {
	return base10.indexOf(chr);
}

function toBCD (num, code) {
	var converted = "";
	for(var rt=0; rt<num.length; ++rt)
		if(num[rt]=='.')
			converted += '.'
		else
			converted = converted + code[parseChar(num[rt])];
	return converted;
}