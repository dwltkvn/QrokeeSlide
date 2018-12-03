const lambda = async (event, context) => {
  //console.log("H");
  return { statusCode: 200, body: "1.0.21.0" };
};

//lambda().then(data => console.log(data));

exports.handler = lambda;
