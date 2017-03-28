<?php
header('Content-type: application/json');
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);
$parameters=$input['result']['parameters'];
$data=json_decode(file_get_contents('int-rates.json'),true);
$bankname=$parameters['bank-name'];
$amount=$parameters['amount'];
$senior=$parameters['senior'];
$duration=$parameters['duration'];
$durationInDays=0;
if($duration['unit']=='mo'){
	$durationInDays=$duration['amount']*30;
}
else if($duration['unit']=='yr'){
	$durationInDays=$duration['amount']*365;
}
else if($duration['unit']=='day'){
	$durationInDays=$duration['amount'];
}
$bankdata=$data[$bankname];
$intRates='';
foreach ($bankdata as $value)
{
	if($durationInDays<= $value['DatesEnd']){
		$isTrue = ['true',1,'yes'];
		if(in_array(strtolower($senior),$isTrue)){
			$intRates=$value['senior'];
		}
		else{
			$intRates=$value['normal'];
		}
            break;
	}
}
$speechText='The interest rate for '.$bankname.' for a period of '.$duration['amount'].' '.$duration['unit'].' is '.$intRates;
echo '{"speech":"'.$speechText.'","displayText":"'.$speechText.'","source":"Bank Website"}';
?>