$(document).ready(function() {

    // init foundation
    $(document).foundation()

    var docWidth = $(document).width();
    console.log(docWidth);

    // window.onresize = getArrowPosition();

    $(window).resize(function() {
        if (docWidth >= 1250) {
            var arrowRight = docWidth - 1200;
            arrowRight = arrowRight / 2 + "px";
            document.getElementById("arrowBox").style.right = arrowRight;
            console.log(arrowRight + "set the right style");
        }
    });

    if (docWidth >= 1250) {
        var arrowRight = docWidth - 1230;
        arrowRight = arrowRight / 2 + "px";
        document.getElementById("arrowBox").style.right = arrowRight;
        console.log(arrowRight + "set the right style");
    }


    // init accordion
    $("#accordion").accordion({
        collapsible: true,
        active: 'none',
        heightStyle: "content"
    });

    // swap +/i on accordion click
    $('.ui-state-default').on('click', function() {
        var thisOne = $(this).find('.acc-sprite span');
        var theOthers = $('.acc-sprite span').not(thisOne);

        // reset the others
        theOthers.html('+');

        // toggle active item
        if (thisOne.html() === '-') {
            thisOne.html('+');
        } else {
            thisOne.html('-');
        }
    });


    // init parsley
    $('#form').parsley();


    // dynamically build sidebar based on form HTML
    buildSidebar();


    // show and hide sidebar selections based on checkbox selections
    $('input:checkbox').on('click', function(e) {

        if ($(this).hasClass('locked') || $(this).hasClass('grayed-out')) {
            // this item is locked - do nothing
        } else { // else toggle it in the sidebar
            var classToShow = '.' + $(this).attr('id');
            $(classToShow).toggle();
        }
    })



    // uncheck selections on click 'remove'
    $('.remove').on('click', function(e) {
        if ($(this).find("a").length > 0) {
            // this is a locked item - do nothing
        } else {
            // otherwise - uncheck it and it'll be removed from sidebar
            // get the class of the tr which matches the checkbox ID
            checkBoxToRemove = '#' + $(this).closest('tr').attr('class');
            $(checkBoxToRemove)[0].click();
        }
    });


    // show sidebar sections in parallel to using accordion
    $('.acc-header').on('click', function() {
        $('#empty-stack').hide();
    });

    $('.acc-header').on('click', function() {
        $('#view-product-stack').show();
    });
    $('.acc-header').on('click', function() {
        $('#automation-sidebar').show();
    });
    $('.acc-header').on('click', function() {
        $('#product-stack').show();
    });
    $('#application-development-accordion-header').on('click', function() {
        $('#application-development-sidebar').show();
    });
    $('#devops-tools-accordion-header').on('click', function() {
        $('#devops-tools-sidebar').show();
    });
    $('#container-platform-accordion-header').on('click', function() {
        $('#container-platform-sidebar').show();
    });
    $('#iaas-accordion-header').on('click', function() {
        $('#iaas-sidebar').show();
    });



    // fancy stuff
    var submitted = getQueryVariable('submit')
    if (submitted == 'Submit') {
        console.log('loading page submitted with GET variables in URL');
        $('#confirmation').show();
        $('.share-row').show();
        buildConfirmationPage();
        $('.match-height').matchHeight();
        //$('.odd-section-block').matchHeight();
    } else {
        console.log('loading page CLEAN')
        $('#home').show();
    }

    $(window).resize(function() {
        positionArrow('#application-development-row');
        positionArrow('#devops-tools-row');
        positionArrow('#container-platform-row');
        positionArrow('#iaas-row');
    })

});


function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}




function buildSidebar() {
    // for each block section in the form
    $('.block-section').each(function() {

        // get block section ID and convert to table ID
        var tableId = '#' + $(this).attr('id') + '-table';

        // for all .text span tags with our checkbox name hidden inside them
        $('span.text', this).each(function() {

            // capture the ID of the nearest input tag to insert as table row class
            var tableRowClass = $(this).closest('.columns').find('input').attr('id');

            // build unique table row with that name
            var buildRow = '<tr class=' + tableRowClass + '><td class="selection">' + $(this).text() + '</td><td class="remove"><span><img src="images/delete.png"></span></td></tr>'

            // update table in sidebar
            $(tableId).append(buildRow);

        });


    });

    // show locked forms items dynamically in sidebar w/ lock icon
    $('input.locked').each(function() {

        // show the table row
        var tableRowToShow = $(this).attr('id');
        $('tr.' + tableRowToShow).show();

        // replace the remove option with lock icon
        var lockedIcon = '<img src="images/lock.png" class="locked-icon" />'
        $('tr.' + tableRowToShow + ' td.remove').html(lockedIcon);
    });

    // show grayed out forms items dynamically in sidebar w/ gray icon
    $('input.grayed-out').each(function() {

        // show the table row
        var tableRowToShow = $(this).attr('id');
        $('tr.' + tableRowToShow).show();

        // replace the remove option with gray icon
        var grayIcon = '<img src="images/gray.png" class="locked-icon" />'
        $('tr.' + tableRowToShow + ' td.remove').html(grayIcon);
    });

}






function buildConfirmationPage() {

    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
        var string = vars[i].split("=")[0];
        var imageClass = $('#confirmation .' + string);

        // exception to the pattern  - source control management
        if (string === 'source-control-management') {
            var value = vars[i].split("=")[1];
            imageClass = $('#confirmation .' + value);
        }

        // all other images
        if ($(imageClass).attr('src')) { // if there is a source attribute IE if it's an image
            var imgSrc = $(imageClass).attr('src') // grab the img src
            if ($(imageClass).attr('src').indexOf('-grey') >= 0) { // if that source contains -grey
                var newSource = $(imageClass).attr('src').replace('-grey', ''); // remove it
                $(imageClass).attr('src', newSource) // and update the source
            }
        }
        // now show those updates images
        $(imageClass).show();
    }

    centerAutomationImage();

    positionArrow('#application-development-row');
    positionArrow('#devops-tools-row');
    positionArrow('#container-platform-row');
    positionArrow('#iaas-row');

    buildSocialLinks();

    $('.links-row').show();

} /* close buildConfirmationPage function */



function buildScreenShot() {
    html2canvas($('#main-graphic'), {
        //logging: true,
        allowTaint: true,
        onrendered: function(canvas) {
            var setWidth = $('#main-graphic').width() + 'px';
            console.log(setWidth);
            $('.image-container').html(canvas);
            $('.image-container canvas').css("width", setWidth)

        },
    }).then(function() {
        window.print();
        return false;
    })

}




function positionArrow(row) {
    // note: horizontal centering in JS done to workaround html3canvas CSS rendering differences

    // calculate top red header area height and include padding
    var confBodyHeaderHeight = $(row + ' .conf-acc-header').height();
    var includePadding = 30 /* padding of .conf-acc-header adds to total height */
    confBodyHeaderHeight = confBodyHeaderHeight + includePadding

    // get total height area
    var confBodyHeight = $(row + ' .conf-body').height();

    // get position from top we need to center arrow
    var newHeight = ((confBodyHeight / 2)) + confBodyHeaderHeight;
    var arrow = $(row + ' .automation-arrow')
    arrow.css("top", newHeight)

    if (row === '#container-platform-row') {
        newHeight = newHeight + 20
        arrow.css("top", newHeight)
    }
}



function centerAutomationImage() {
    if ($(window).width() > 1024) {
        // center automation vertical image - css bug with printing html2canvas workaround
        var fixSpacing = 40
        var matchToContainerPlatform = $('#container-platform-row').offset().top - $('#automation-conf .conf-body').offset().top - fixSpacing
        $('#automation-conf .ansible').css('padding-top', matchToContainerPlatform)
    }
}


function buildSocialLinks() {

    $("#share").jsSocials({
        showLabel: true,
        showCount: false,
        shareIn: "popup",
        shares: [
            "facebook",
            "twitter",
            "email",
            "print"
        ]
    });

    // update print link in the DOM with custom html
    var printLink = '<a href="#" onclick="buildScreenShot();" class="jssocials-share-link"><i class="jssocials-share-logo" aria-hidden="true"></i><span class="jssocials-share-label">Print / PDF</span></a>'
    $('.jssocials-share-print').html(printLink)

}









/* for reference - not in use currently */
function equalizeHeights() {
    console.log('inside equalizeHeights...')
    if ($(window).width() > 1024) {
        console.log('inside equalizeHeights > 1024...')
            // infrastructure sections with borders- make right side equal height of left side
        $('#identity-management-conf').height($('#networking-conf').height()).css('padding-top', '25px');
        $('#certificate-management-conf').height($('#storage-conf').height()).css('padding-top', '25px');

        // make grey dividers equal heights
        $('#private-conf.conf-section').height($('#oddball-row').height());
        $('#public-conf.conf-section').height($('#oddball-row').height());

        // make automation vertical same height as 4 stacked rows
        /*var borderWidth = 10;
        var startFromBottomOfDiv = $('#iaas-row .conf-body').offset().top + $('#iaas-row .conf-body')[0].offsetHeight - borderWidth;
        var distance = startFromBottomOfDiv - $('#confirmation').offset().top;

        $('#automation-conf').height(distance);*/

        // center automation vertical image - css bug with printing html2canvas workaround
        var fixSpacing = 40
        var matchToContainerPlatform = $('#container-platform-row').offset().top - $('#automation-conf .conf-body').offset().top - fixSpacing

        $('#automation-conf .ansible').css('padding-top', matchToContainerPlatform)
    } else {

        $('#identity-management-conf').css('height', 'auto').css('padding', '20px');
        $('#certificate-management-conf').css('height', 'auto').css('padding', '20px');

        // auto height on smaller screens
        $('#private-conf.conf-section').css('height', 'auto');
        $('#public-conf.conf-section').css('height', 'auto');

        // auto height on smaller screens
        $('#automation-conf').css('height', 'auto');

        // padding on smaller screens
        $('#automation-conf .ansible').css('padding', '20px')
    }
}

function callStack(){
    if (window.internal && window.internal == true){
        var projectName = prompt('Enter project name');

        console.log( getLocation( window.location.href ).hostname );

        passwordRequired(function(passwordIsRequired){
            var userPasswordHash;
            if (passwordIsRequired === true){
                var buildPassword = prompt('Enter build password');
                var buildPasswordHash = Sha1.hash(buildPassword);
            } 
            var url = getBackendUrlBasedOnLocation( 'window.location.href' ) + '/stack'
            $.post(url, {projectName: projectName, buildPasswordHash: buildPasswordHash, getUrl: window.location.href}, function(result){
                  alert(result);
            });

        });

        return false;
    } else {
        console.log('redirecting');
        window.location = 'https://www.redhat.com/en/explore/open-innovation-labs';
        return false;
    }

    
}


if (window.internal && window.internal == true){
    $("#form").attr("action", 'internal.html');

}
