var mainButton = document.getElementById("mainButton");
var originalNumberCont = document.getElementById("originalNumber");
var toCode = document.getElementById("convertTo");
var error = [document.getElementById("e1"), document.getElementById("e2"), document.getElementById("e3")];

var result = document.getElementById("result");

var base10 = "0123456789"

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

	if(!check(num, 2)){
		showError("Conversion Failed", "console");
		return -1;
	}

	switch(code) {
		case "gray": show(toGray(num));
					break;
		case "bin": show(fromGraytoBin(num));
					 break;
		default : showError("Something went horrendously wrong", "input");
	}
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
		if(decimals>0){
			showError("Sorry, integers only. Decimal at position " + (rt+1) +" of number", "input");
			flag = 1;
			break;
		}
	}

	if( flag==1 ) {
		return false;
	}

	return true;
}

function parseChar (num) {
	return base10.indexOf(num);
}

function toGray (num) {
	var converted = "";
	converted += num[0];
	for(var i=1; i<num.length; ++i)
		converted += num[i-1]!=num[i]?'1':'0';			//Implements XOR, TRUE(1) iff x!= y else FALSE(0)
	return converted;
}

function fromGraytoBin (num) {
	var converted = "";
	converted += num[0];
	for(var i=1; i<num.length; ++i)
		converted += converted[i-1]!=num[i]?'1':'0';			//Implements XOR, TRUE(1) iff x!= y else FALSE(0)
	return converted;
}