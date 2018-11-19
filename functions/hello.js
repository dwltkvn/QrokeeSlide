const lambda = async (event, context) => {
  console.log("H");
  return { statusCode: 200, body: "Hello World!" };
};

//myLambda();

exports.handler = lambda;
