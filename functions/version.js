const lambda = async (event, context) => {
  //console.log("H");
  return { major: 1, minor:0, patch:21, revision:0 };
};

//lambda().then(data => console.log(data));

exports.handler = lambda;
