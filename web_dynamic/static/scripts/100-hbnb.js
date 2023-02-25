$(document).ready(function () {
  let idDictAmenity = {};
  let idDictCity = {};
  let idDictState = {};
  // Listen for checkboxes to be checked for Amenities
  $(".amenities input:checkbox").change(function () {
    if ($(this).is(":checked")) {
      idDictAmenity[$(this).attr("data-name")] = $(this).attr("data-id");
    } else {
      delete idDictAmenity[$(this).attr("data-name")];
    }
    let list = [];
    $.each(idDictAmenity, function (index, value) {
      list.push(index);
    });
    // Display items checked on the web page
    if (list.length === 0) {
      $(".amenities h4").html("&nbsp;");
    } else {
      $(".amenities h4").text(list.join(", "));
    }
  });

  // Listen for checkboxes on States
  $('input:checkbox[id="state"]').change(function () {
    if ($(this).is(":checked")) {
      idDictState[$(this).attr("data-name")] = $(this).attr("data-id");
    } else {
      delete idDictState[$(this).attr("data-name")];
    }
    appendText();
  });

  // Listen for checkboxes on Cities
  $('input:checkbox[id="city"]').change(function () {
    if ($(this).is(":checked")) {
      idDictCity[$(this).attr("data-name")] = $(this).attr("data-id");
    } else {
      delete idDictCity[$(this).attr("data-name")];
    }
    appendText();
  });

  // Display items checked on the web page for City/State H4
  function appendText() {
    let list = [];
    $.each(idDictCity, function (index) {
      list.push(index);
    });
    $.each(idDictState, function (index) {
      list.push(index);
    });
    if (list.length === 0) {
      $(".locations h4").html("&nbsp;");
    } else {
      $(".locations h4").text(list.join(", "));
    }
  }

  // GET request for server status
  $.get(
    "http://54.166.124.241/api/v1/status",
    function (data) {
      if (data["status"] === "OK") {
        $("DIV#api_status").addClass("available");
      } else {
        $("DIV#api_status").removeClass("available");
      }
    },
    "json"
  );

  // POST request for initial web page load
  $.ajax({
    type: "POST",
    url: "http://54.166.124.241/api/v1/places_search",
    contentType: "application/json",
    dataType: "json",
    data: "{}",
    success: createPlaces,
  });

  // Listen for click on filter button
  $("button").click(function () {
    let amenityList = [];
    let cityList = [];
    let stateList = [];
    stateList = $.map(idDictState, function (value, key) {
      return value;
    });
    cityList = $.map(idDictCity, function (value, key) {
      return value;
    });
    amenityList = $.map(idDictAmenity, function (value, key) {
      return value;
    });
    $.ajax({
      type: "POST",
      url: "http://54.166.124.241/api/v1/places_search",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        amenities: amenityList,
        states: stateList,
        cities: cityList,
      }),
      success: createPlaces,
    });
  });

  // Load the places
  function createPlaces(data) {
    let places = [];

    // Sort by name
    data.sort(function (obj1, obj2) {
      if (obj1.name < obj2.name) return -1;
      if (obj1.name > obj2.name) return 1;
      return 0;
    });

    // loops through the sorted array
    for (let i in data) {
      const name = data[i].name;
      const price = data[i].price_by_night;
      const desc = data[i].description;
      const guest = data[i].max_guest;
      const bed = data[i].number_rooms;
      const bath = data[i].number_bathrooms;
      let place = `
      <ARTICLE>
        <div class="title">
	      <h2>${name}</h2>
	    <div class="price_by_night">$${price}</div>
         </div>
	 <div class="information">
	   <div class="max_guest">
             <i class="fa fa-users fa-3x" aria-hidden="true"></i>
             <br>${guest} ${guest > 1 ? "Guests" : "Guest"}
           </div>
           <div class="number_rooms">
	     <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
             <br>${bed} ${bed > 1 ? "Bedrooms" : "Bedroom"}            
           </div>
           <div class="number_bathrooms">
             <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
             <br>${bath} ${bath > 1 ? "Bathrooms" : "Bathroom"}
           </div>
	 </div>
         <div class="description">${desc}</div>
      </ARTICLE>
      `;
      places.push(place);
    }
    // Remove previously appended data
    $(".places").empty();
    // Append new data
    $(".places").append(places);
  }
});
