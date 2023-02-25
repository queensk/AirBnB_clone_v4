$(document).ready(function () {
  let idDict = {};
  $("input:checkbox").change(function () {
    if ($(this).is(":checked")) {
      idDict[$(this).attr("data-name")] = $(this).attr("data-id");
    } else {
      delete idDict[$(this).attr("data-name")];
    }
    let list = [];
    $.each(idDict, function (index, value) {
      list.push(index);
    });
    if (list.length === 0) {
      $(".amenities h4").text("");
    } else {
      $(".amenities h4").text(list.join(", "));
    }
  });

  $.get(
    "http://0.0.0.0:5001/api/v1/status",
    function (data) {
      if (data["status"] === "OK") {
        $("DIV#api_status").addClass("available");
      } else {
        $("DIV#api_status").removeClass("available");
      }
    },
    "json"
  );
});
