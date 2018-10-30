'use strict';

window.filter = (function () {

  var maxRenderedPins = window.constants.MAX_RENDERED_PINS;
  var lowPrice = window.constants.Price.LOWER_LIMIT;
  var highPrice = window.constants.Price.HIGHER_LIMIT;
  var lowValue = window.constants.ValueRange.LOW;
  var middleValue = window.constants.ValueRange.MIDDLE;
  var highValue = window.constants.ValueRange.HIGH;
  var anyValue = window.constants.ValueRange.ANY;
  var debounceInterval = window.constants.DEBOUNCE_INTERVAL;

  var array = [];
  var callback;


  var filterForm = document.querySelector('.map__filters');

  var typeFilter = function (object) {

    var adType = object.offer.type;
    var typeFilterValue = filterForm.querySelector('#housing-type')
                                    .value;

    if (typeFilterValue === anyValue) {
      return true;
    } else {
      return adType === typeFilterValue;
    }
  };

  var priceFilter = function (object) {

    var adPrice = object.offer.price;
    var priceFilterValue = filterForm.querySelector('#housing-price')
                                      .value;

    if (priceFilterValue === lowValue) {
      return adPrice < lowPrice;
    } else if (priceFilterValue === middleValue) {
      return adPrice > lowPrice && adPrice < highPrice;
    } else if (priceFilterValue === highValue) {
      return adPrice > highPrice;
    } else {
      return true;
    }
  };

  var roomsFilter = function (object) {

    var adRooms = object.offer.rooms;
    var roomsFilterValue = filterForm.querySelector('#housing-rooms')
                                      .value;

    if (roomsFilterValue === anyValue) {
      return true;
    } else {
      roomsFilterValue = +roomsFilterValue;
      return adRooms === roomsFilterValue;
    }
  };

  var guestsFilter = function (object) {

    var adGuests = object.offer.guests;
    var guestsFilterValue = filterForm.querySelector('#housing-guests')
                                        .value;

    if (guestsFilterValue === anyValue) {
      return true;
    } else {
      guestsFilterValue = +guestsFilterValue;
      return adGuests === guestsFilterValue;
    }
  };

  var featuresFilter = function (object) {

    var adFeatures = object.offer.features;
    var featuresCollection = filterForm.querySelector('#housing-features')
                                        .elements;
    var featuresSelected = [];

    for (var i = 0; i < featuresCollection.length; i++) {
      if (featuresCollection[i].checked) {
        featuresSelected.push(featuresCollection[i].value);
      }
    }

    if (featuresSelected.length > 0) {

      var featuresIsContained = [];

      featuresSelected.forEach(function (element) {
        featuresIsContained.push(adFeatures.includes(element));
      });

      return !featuresIsContained.includes(false);
    } else {
      return true;
    }

  };

  var getFilteredData = function () {
    var filteredData = array.filter(typeFilter)
                          .filter(priceFilter)
                          .filter(roomsFilter)
                          .filter(guestsFilter)
                          .filter(featuresFilter)
                          .slice(0, maxRenderedPins);

    callback(filteredData);
  };

  var onFilterFormChange = window.debounce(getFilteredData, debounceInterval);

  return function (arr, cb) {

    array = arr;
    callback = cb;

    getFilteredData();

    filterForm.addEventListener('change', onFilterFormChange);

  };

})();
