$(document).ready(function(){
   
    $('.container > .tabs li').click(function(){
      var tab_id = $(this).attr('data-tab');
   

      $('.container > .tabs li').removeClass('current');
      $('.container > .tab-container').removeClass('current');
   
      $(this).addClass('current');
      $("[data-container="+tab_id+"]").addClass('current');
    })

    $('.tab-container > .tabs li').click(function(){
        var content_id = $(this).attr('data-tab');

        $('.tab-container > .tabs li').removeClass('current');
        $('.tab-container > .content').removeClass('current');

        $(this).addClass('current');
        $("#"+content_id).addClass('current');
    })
  
  })