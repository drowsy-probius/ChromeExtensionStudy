$(document).ready(function () {

  $('.container > .tabs > .tab-link').click(function () {
    let tab_id = $(this).attr('data-tab');  // 선택한 탭의 id(course id)

    if ($(this).attr('class').search("current") === -1) {
      $('.container > .tabs > .tab-link').removeClass('current');
      $('.container > .tabs > .tab-container').removeClass('current');
      $('.tab-container > .tabs > .content-link').removeClass('current');
      $('.tab-container > .content').removeClass('current');

      $(this).addClass('current');
      $("[data-container=" + tab_id + "]").addClass('current');
    } else {
      $('.container > .tabs > .tab-link').removeClass('current');
      $('.container > .tabs > .tab-container').removeClass('current');
      $('.tab-container > .tabs > .content-link').removeClass('current');
      $('.tab-container > .content').removeClass('current');
    }


  })

  $('.tab-container > .tabs > .content-link').click(function () {
    let content_id = $(this).attr('data-tab');

    $('.tab-container > .tabs > .content-link').removeClass('current');
    $('.tab-container > .content').removeClass('current');

    $(this).addClass('current');
    $("#" + content_id).addClass('current');
  })

})