(function ($) {
  $.entwine('ss', function ($) {

    $('input.googleplaces').entwine({
      onmatch: function () {

        function whenGoogleLoadedDo(func) {
          if (typeof google != 'undefined') {
            func();
          } else {
            setTimeout(function () {
              (function (func) {
                whenGoogleLoadedDo(func)
              })(func)
            }, 150);
          }
        }

        var _this = this;
        var form = this.closest('form');
        var autocomplete;

        function onPlaceChanged() {
          var mapping = {
            'postal_code': {
              'name': 'zipcode',
              'use': 'long_name'
            },
            'country': {
              'name': 'country',
              'use': 'long_name',
              'secondary_name': 'countrycode',
              'secondary_use': 'short_name'
            },
            'locality': {
              'name': 'city',
              'use': 'long_name'
            },
            'street_number': {
              'name': 'streetnumber',
              'use': 'long_name'
            },
            'route': {
              'name': 'street',
              'use': 'long_name'
            },
            'administrative_area_level_1': {
              'name': 'state',
              'use': 'long_name'
            }
          };
          var data = {
            'zipcode': false,
            'country': false,
            'countrycode': false,
            'city': false,
            'streetnumber': false,
            'street': false,
            'state': false
          };
          var place = autocomplete.getPlace();

          for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            var mapped = mapping[addressType];
            if (mapped) {
              data[mapped['name']] = place.address_components[i][mapped['use']];
              if(mapped.secondary_name){
                data[mapped['secondary_name']] = place.address_components[i][mapped['secondary_use']];
              }
            }
          }
          data['latitude'] = place.geometry.location.lat();
          var latitudeSplit = (data['latitude'] + '').split('.');
          if(latitudeSplit[1].length > 8){
            data['latitude'] = latitudeSplit[0] + '.' + (latitudeSplit[1] + '').substring(0, 8);
          }
          data['longitude'] = place.geometry.location.lng();
          var longitudeSplit = (data['longitude'] + '').split('.');
          if(longitudeSplit[1].length > 8){
            data['longitude'] = longitudeSplit[0] + '.' + (longitudeSplit[1] + '').substring(0, 8);
          }
          data['mapurl'] = place.url;
          data['placeid'] = place.place_id;
          data['htmladdress'] = place.adr_address;
          for (var key in data) {
            var fieldname = _this.data(key + 'field');
            var field = form.find('[name="' + fieldname + '"]');
            if (data[key]) {
              field.val(data[key]);
            } else {
              field.val('');
            }
          }
        }


        whenGoogleLoadedDo(function () {
          autocomplete = new google.maps.places.Autocomplete(_this[0], {
            
          });
          autocomplete.addListener('place_changed', onPlaceChanged);
        });

      }
    });

  });
})(jQuery);
