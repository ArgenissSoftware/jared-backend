var assert = require("assert");
var UserModel = require("../../../server/models/user.model");

describe("Application registration requirement", function(){
  var user;

  before(function(){
    user = new UserModel({
      username: "username1",
      email: "rodrigo@argeniss.com",
      password: "password1"
    });
  });

/// Comment
  describe("Registration is successful if", function(){
    it("All is valid", function(){
      assert(user.userIsValid());
    });
    it("Username is defined", function(){
      assert(user.usernameIsValid());
    });
    it("Email is defined and contains @", function(){
      assert(user.emailIsValid());
    });
    it("Password is defined", function(){
      assert(user.passwordIsValid());
    });
  });

  describe("Registration fail if", function(){
    it("Email does not contain @", function(){
      user = new UserModel({
        email: "rodrigoargeniss.com"
      });
      assert(!user.emailIsValid());
    })
  });
});
