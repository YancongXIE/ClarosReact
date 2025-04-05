const loginData = {
    email: "xieyancong@gmail.com",
    password: "123123"
  };
  
  const endpoint = "https://z3ruo3gka6hewrcltrvnq2kere0byjlm.lambda-url.us-east-1.on.aws/users/login"; // adjust the URL as needed
  
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });
  
  const data = await res;

  console.log("Data", data);
