var CustomToken = artifacts.require("CustomToken");

contract("CustomToken", function(accounts) {
  it("should assert true", function(done) {
    var custom_token = CustomToken.deployed();
    assert.isTrue(true);
    done();
  });
});
