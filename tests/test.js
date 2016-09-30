QUnit.module("test module", {
  beforeEach: function() {},
  afterEach: function() {}
});

QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test("Email validator should add class invalid to the input", function(assert) {
    F.open("../index.html", function () {
        F("input.email").visible(function (el) {
            el.type("test");
            el.next().click(function() {
                assert.ok(el.hasClass("invalid"));
            });
        });
    });
    assert.expect(0);   // this is needed to prevent QUnit warning
});