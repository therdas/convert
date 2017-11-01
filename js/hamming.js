var mainButton = document.getElementById("mainButton");
var originalNumberCont = document.getElementById("originalNumber");
var modeCont = document.getElementById("mode");
var rednCont = document.getElementById("code");

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
		result = "Press convert!";
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
}

function convert () {
	var num = originalNumber.value;
	var mode = modeCont.value;
	var redn = Number(rednCont.value);

	clearErrors();

	if(!check(num, 2)){
		showError("Conversion failed", "console");
		return false;
	}

	switch(mode) {
		case "encode": show(toHamming(num, redn));
					break;
		case "check": checkHamming(num, redn);
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

function xor() {
	if(arguments.length == 0)
		return false;
	
	var num = 0;
	for(var rt=0; rt<arguments.length; ++rt)
		num += Number(arguments[rt]);
	if((num%2) == 1)
		return '1';
	else
		return '0';

}

function toHamming (num, redundant = 3) {
	if( (redundant==3)&&(num.length!= 4) ||
		(redundant==4)&&(num.length!=11) ||
		(redundant==2)&&(num.length!= 1)   ) {
		showError("Not enough input bits for code. A Hamming(x,y) code requires message of length y. If your message is smaller than y, add zeros to the end of it till it reaches the nearest largest y", "input");
		return;
	}

	if(redundant == 3) {
		var h1 = xor(num[0], num[1], num[3]);
		var h2 = xor(num[0], num[2], num[3]);
		var h3 = xor(num[1], num[2], num[3]);
		return ""+h1+h2+num[0]+h3+num[1]+num[2]+num[3];
	} else if (redundant == 4) {
		var h1 = xor(num[0], num[1], num[3], num[4], num[6], num[8], num[10]);
		var h2 = xor(num[0], num[2], num[3], num[5], num[6], num[9], num[10]);
		var h3 = xor(num[1], num[2], num[3], num[7], num[8], num[9], num[10]);
		var h4 = xor(num[4], num[5], num[6], num[7], num[8], num[9], num[10]);
		return ""+h1+h2+num[0]+h3+num[1]+num[2]+num[3]+h4+num[4]+num[5]+num[6]+num[7]+num[8]+num[9]+num[10];
	} else if (redundant == 1) {
		return ""+num+num+num;
	}
}

function checkHamming (ham, redundant) {
	var corrected = "";

	if( (redundant==3)&&(ham.length!= 7) ||
		(redundant==4)&&(ham.length!=15) ||
		(redundant==2)&&(ham.length!= 3)   ) {
		showError("Not enough input bits for code. A Hamming(x,y) code requires message of length y", "input");
		return false;
	}

	if(redundant==3){
		var c1 = xor(ham[0], ham[2], ham[4], ham[6]);
		var c2 = xor(ham[1], ham[2], ham[5], ham[6]);
		var c3 = xor(ham[3], ham[4], ham[5], ham[6]);
		var c4 = 0;
	} else if(redundant==4) {
		var c1 = xor(ham[0], ham[2], ham[4], ham[6], ham[8], ham[10], ham[12], ham[14]);
		var c2 = xor(ham[1], ham[2], ham[5], ham[6], ham[9], ham[10], ham[13], ham[14]);
		var c3 = xor(ham[3], ham[4], ham[5], ham[6], ham[11], ham[12], ham[13], ham[14]);
		var c4 = xor(ham[7], ham[8], ham[9], ham[10], ham[11], ham[12], ham[13], ham[14]);
	}
	var binErrorAt = ""+c4+c3+c2+c1;
	var errorAt = Number(c4)*8+Number(c3)*4+Number(c2)*2+Number(c1)*1;

	if(errorAt == 0)
		show("The code is corrected, no error found.")
	else {

		console.log("Error at bit "+errorAt+" code "+binErrorAt );

		for(var i=0; i<ham.length; ++i) {
			if(i == (errorAt-1) )
				corrected += (ham[i]=='1')?'0':'1';
			else
				corrected += ham[i];
		}

		console.log("Corrected: " + corrected);
		show("Error found at bit "+errorAt+", code "+binErrorAt
			+"<br/>"+"Corrected code: "+corrected);
	}
}