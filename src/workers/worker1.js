export default () => {
  self.addEventListener("message", e => {    // eslint-disable-line no-restricted-globals
    if (!e) return;

    const users = [];
    const a = 1;
    const userDetails = {
      name: "Jane Doe",
      email: "jane.doe@gmail.com",
      id: 1
    };

    for (let i = 0; i < 10000000; i++) {
      userDetails.id = i++;
      userDetails.dateJoined = Date.now();

      users.push(userDetails);
    }

    postMessage(users);
  });
};
