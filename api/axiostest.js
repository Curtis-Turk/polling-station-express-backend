const axios = require("axios");

const axiosTest = async () => {
  try {
    const response = await axios.get(
      // `https://api.electoralcommission.org.uk/api/v1/postcode/blah/?token=ea937ea9ad83ddbdc94fc8347d086a5edd31893c`
      "lkjalkja"
    );
  } catch (e) {
    // console.log(response.status);
    console.log(e.response);
    /*
    e.response = {
      message: error message
      data: response json
      status: 400
    }
    */
    console.log("hello world");
  }
};

axiosTest();

// https://stackoverflow.com/questions/39153080/how-can-i-get-the-status-code-from-an-http-error-in-axios
