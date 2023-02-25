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
      $(".amenities h4").html("&nbsp;");
    } else {
      $(".amenities h4").text(list.join(", "));
    }
  });
});
