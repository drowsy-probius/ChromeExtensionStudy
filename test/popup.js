$(document).ready(function(){
   
    $('.tabs li').click(function(){
      var tab_id = $(this).attr('data-tab');
   
      $('.tabs li').removeClass('current');
      $('.tab-content').removeClass('current');
   
      $(this).addClass('current');
      $("#"+tab_id).addClass('current');
    })

    // $('tabintabs li').click(function(){
    //     var tabintabs_id = $(this).attr('data-tab');

    //     $('tabintabs li').removeClass('current');
    //     $('.tab-content').removeClass('current');

    //     $(this).addClass('current');
    //     $("#"+tabintabs_id).addClass('current');
    // })
   
  })