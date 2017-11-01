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

function toGrey (num) {
	var converted = "";
	converted += num[0];
	for(var i=1; i<num.length; ++i)
		converted += num[i-1]!=num[i]?'1':'0';			//Implements XOR, TRUE(1) iff x!= y else FALSE(0)
	return converted;
}

function fromGreytoBin (num) {
	var converted = "";
	converted += num[0];
	for(var i=1; i<num.length; ++i)
		converted += converted[i-1]!=num[i]?'1':'0';			//Implements XOR, TRUE(1) iff x!= y else FALSE(0)
	return converted;
}

function toHamming (num) {
	if(num.length!=4){
		showError("Number of data bits required for (7,4) Hamming code is 4. Check input data");
		return;
	}
	var h1 = ( (Number(num[0]) + Number(num[1]) + Number(num[3])) % 2 ) == 1 ? '1':'0';
	var h2 = ( (Number(num[0]) + Number(num[2]) + Number(num[3])) % 2 ) == 1 ? '1':'0';
	var h3 = ( (Number(num[1]) + Number(num[2]) + Number(num[3])) % 2 ) == 1 ? '1':'0';
	return ""+h1+h2+num[0]+h3+num[1]+num[2]+num[3];
}

function checkHamming (ham) {
	var corrected = "";

	if(ham.length!=7){
		console.log("Number of data bits required for (7,4) Hamming code is 4. Check input data");
		return;
	}

	var c1 = ( (Number(ham[0]) + Number(ham[2]) + Number(ham[4]) + Number(ham[6])) % 2 ) == 1 ? '1':'0';
	var c2 = ( (Number(ham[1]) + Number(ham[2]) + Number(ham[5]) + Number(ham[6])) % 2 ) == 1 ? '1':'0';
	var c3 = ( (Number(ham[3]) + Number(ham[4]) + Number(ham[5]) + Number(ham[6])) % 2 ) == 1 ? '1':'0';

	var binErrorAt = ""+c3+c2+c1;
	var errorAt = Number(c3)*4+Number(c2)*2+Number(c1)*1;

	if(errorAt == 0)
		console.log("AOK!")
	else {

		console.log("Error at bit "+errorAt+" code "+binErrorAt );

		for(var i=0; i<ham.length; ++i) {
			if(i == (errorAt-1) )
				corrected += (ham[i]=='1')?'0':'1';
			else
				corrected += ham[i];
		}

		console.log(" Corrected: " + corrected);
	}
}