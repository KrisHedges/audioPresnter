'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioPresentation = function () {
  function AudioPresentation() {
    _classCallCheck(this, AudioPresentation);

    this.state = {
      presenter_elements: Array.from(document.getElementsByClassName('audio-presentation')),
      presenters: []
    };
  }

  _createClass(AudioPresentation, [{
    key: 'start',
    value: function start() {
      var _this = this;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var _step$value = _slicedToArray(_step.value, 2),
              index = _step$value[0],
              presenter = _step$value[1];

          var timeline_url = presenter.getAttribute('data-timeline');

          _this.render(presenter);

          fetch(timeline_url).then(function (response) {
            response.json().then(function (timeline_data) {
              this.addPresenter(timeline_data, presenter);
              this.bindEvents();
            }.bind(this));
          }.bind(_this));
        };

        for (var _iterator = this.state.presenter_elements.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'render',
    value: function render(presenter) {
      var source = presenter.getAttribute('data-source'),
          message = presenter.getAttribute('data-message'),
          template = '\n          <div class="player">\n            <progress value="0" max="100"></progress>\n            <button class="play">Play Presentation</button>\n          </div>\n          <section class="presentation">' + message + '</section>\n          <audio id="music" controls="controls">\n            <source src="' + source + '" type="audio/mpeg" />\n          </audio>\n      ';
      presenter.innerHTML = template;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var presenter = this.state.presenters[this.state.presenters.length - 1];
      presenter.audioElement.load();
      presenter.audioElement.addEventListener('timeupdate', function () {
        this.updateProgress(presenter.progressBar, presenter.audioElement, presenter.presentationElement, presenter.timeline);
      }.bind(this));
      presenter.audioElement.addEventListener('ended', function () {
        this.resetPlayer(presenter);
      }.bind(this));
      presenter.audioElement.addEventListener('pause', function () {
        this.resetPlayer(presenter);
      }.bind(this));
      presenter.playButton.addEventListener('touch', function () {
        this.playPauseAudio(presenter.playButton, presenter.audioElement);
      }.bind(this));
      presenter.playButton.addEventListener('click', function () {
        this.playPauseAudio(presenter.playButton, presenter.audioElement);
      }.bind(this));
    }
  }, {
    key: 'addPresenter',
    value: function addPresenter(timeline_data, presenter) {
      this.state.presenters.push({
        'playButton': presenter.getElementsByClassName('player')[0],
        'audioElement': presenter.getElementsByTagName('audio')[0],
        'progressBar': presenter.getElementsByTagName('progress')[0],
        'presentationElement': presenter.getElementsByClassName('presentation')[0],
        'message': presenter.getAttribute('data-message'),
        'timeline': timeline_data
      });
    }
  }, {
    key: 'playPauseAudio',
    value: function playPauseAudio(button, audio) {
      if (audio.paused) {
        button.classList.add('playing');
        audio.play();
      } else {
        button.classList.remove('playing');
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }, {
    key: 'presentAtTime',
    value: function presentAtTime(now, presentation, timeline) {
      function isSlide(slide) {
        return now >= slide.time ? slide : false;
      }
      var slide = timeline.map(function (slide) {
        return isSlide(slide);
      }).filter(Boolean);
      if (presentation.innerHTML !== slide[slide.length - 1].content) {
        presentation.innerHTML = slide[slide.length - 1].content;
      }
    }
  }, {
    key: 'updateProgress',
    value: function updateProgress(progressbar, audio, presentation, timeline) {
      var now = audio.currentTime;
      var progress = Math.round(now / audio.duration * 100);
      progressbar.value = progress ? progress : 0;
      if (!audio.paused) {
        this.presentAtTime(now, presentation, timeline);
      }
    }
  }, {
    key: 'resetPlayer',
    value: function resetPlayer(presenter) {
      presenter.playButton.classList.remove('playing');
      presenter.presentationElement.innerHTML = presenter.message;
      presenter.audioElement.currentTime = 0;
    }
  }]);

  return AudioPresentation;
}();
