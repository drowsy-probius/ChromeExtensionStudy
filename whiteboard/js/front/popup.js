// 로그인
$('#login').click( () => {
    let stdId = $('#stdId').val();
    let pw = $('#pw').val();
    stdId = stdId.replace(/\s/gi, "");

    if( isNaN(stdId) || pw=="")
    {
        $('#message').text('올바른 정보를 입력해 주세요.')
        if( isNaN(stdId) )
        {
            $('#stdId').val('');
        }else
        {
            $('#pw').val('');
        }
    }else
    {
        $('#message').text('정보를 가져오는 중입니다.')
        _sendMessage({ user: [stdId, pw] });
    }
});

// 메인 탭하고 설정 탭 전환
$('#setting').click( () => {
    if( $('#main').attr('class').search("current") !== -1 ) //현재 main page가 보이는 상태
    {
        $('#main').removeClass('current');
        $('#back').removeClass('hide');

        $('#main').addClass('hide');
        $('#back').addClass('current');
    }else   // 현재 설정 페이지가 보이는 상태
    {
        $('#main').removeClass('hide');
        $('#back').removeClass('current');

        $('#main').addClass('current');
        $('#back').addClass('hide');
    }
});

// 새로고침
$('#reload').click( () => {
    _sendMessage({ act: "reload" });
})

// 강제 새로고침
$('#forcereload').click( () => {
    _sendMessage({ act: "forcereload"});
})

// 자동 새로고침 간격 설정
$('#setinterval').click( () => {
    let period = $('#interval').val();
    if( isNaN(period) )
    {
        $('#interval').val('');
        $('#interval').attr("placeholder", "숫자만 입력해 주세요. (현재 간격: "+period+"분)");
    }else
    {
        _sendMessage({ interval: period });
        $('#interval').val('');
        $('#interval').attr("placeholder", "새로고침 간격(현재: " + period + "분)");

    }
})

// 로그인 할 때, 엔터키로 로그인
$(this).keydown( (key) => {
    if (key.which == 13 && $('#loginform').attr('class').search('hide') === -1) 
    {
        $('#login').click();
    }
});