function checkIncomingData(fieldToValidate: any, responseData: any) {
  var dataField = fieldToValidate;
  var data = responseData;
  var errorMessage = "";

  for (var i = 0; i < dataField.length; i++) {
    if (
      !data[dataField[i]] ||
      data[dataField[i]] == "" ||
      data[dataField[i]] == 0
    ) {
      errorMessage += `${dataField[i]}: Field is empty or null.`;
    }
  }

  return errorMessage;
}

export default checkIncomingData;
