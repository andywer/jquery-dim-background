jasmine.getFixtures().fixturesPath = 'specs/fixtures';

describe('jquery-dim-background', function () {

  var $el;

  beforeEach(function () {
    loadFixtures('fixture.html');
    $el = $('#todim');
  });


  it('is defined', function () {
    expect( $.fn.dimBackground ).toBeDefined();
    expect( typeof $.fn.dimBackground ).toEqual('function');

    expect( $.fn.undim ).toBeDefined();
    expect( typeof $.fn.undim ).toEqual('function');

    expect( $.undim ).toBeDefined();
    expect( typeof $.undim ).toEqual('function');
  });


  it('can be used with jQuery selectors', function () {
    expect( $el.dimBackground ).toBeDefined();
    expect( typeof $el.dimBackground ).toEqual('function');

    expect( $el.undim ).toBeDefined();
    expect( typeof $el.undim ).toEqual('function');
  });


  it('dims and undims without throwing errors', function () {
    $el.dimBackground();
    $el.undim();

    $el.dimBackground();
    $.undim();
  });


  it('creates the curtain and adapts selected DOM node', function () {
    $el.dimBackground();

    var $curtain = $('.dimbackground-curtain');

    expect($curtain).toBeInDOM();
    expect($curtain).toHaveCss({ position: 'fixed' });
    expect($curtain).toHaveCss({ zIndex: ""+$.fn.dimBackground.defaults.curtainZIndex });
    expect($curtain).toHaveCss({
      left: '0px',
      top: '0px'
    });

    expect($el).toHaveCss({ position: 'relative' });
    expect($el.css('z-Index')).toBeGreaterThan( $.fn.dimBackground.defaults.curtainZIndex );
  });


  it('recognizes passed options and calls the callbacks', function (done) {
    var fadeInCbCalled = false,
        fadeOutCbCalled = false;

    var options = {
      darkness: 0.9,
      fadeInDuration: 200,
      fadeOutDuration: 400
    };


    $el.dimBackground(options, function () {
      fadeInCbCalled = true;
    });

    var $curtain = $('.dimbackground-curtain');


    setTimeout(function () {
      expect(fadeInCbCalled).toBeFalsy();
    }, 170);

    setTimeout(function () {
      expect(fadeInCbCalled).toBeTruthy();

      //expect($curtain).toHaveCss({ opacity: options.darkness });

      $el.undim(options, function () {
        fadeOutCbCalled = true;
      });


      setTimeout(function () {
        expect(fadeOutCbCalled).toBeFalsy();
      }, 350);

      setTimeout(function () {
        expect(fadeOutCbCalled).toBeTruthy();
        expect($curtain).not.toBeInDOM();

        done();
      }, 450);
    }, 230);
  });

});
