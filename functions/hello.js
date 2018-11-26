const lambda = async (event, context) => {
  //console.log("H");
  return { statusCode: 200, body: "Hello World!" };
};

//lambda().then(data => console.log(data));

exports.handler = lambda;
