function initMap(){

    this.Zoom = 10;
    this.mapOptions = {
        zoom: this.Zoom,
        panControl: false,
        disableDefaultUI: true,
        center: new google.maps.LatLng(36.046561, -95.815325),
        mapTypeId: google.maps.MapTypeId.ROADMAP
        };

    this.map =
        new google.maps.Map(document.getElementById('map'), this.mapOptions);
}

function ViewModel(){
    var self = this;
    sessionStorage.clear();
    self.maxListNum =
        ko.observable(Math.max(1,Math.ceil(($(window).height() -150)/30)));
    
    self.listVisible = ko.observable(1);
    self.listPoint = ko.observable(1);
    
    if (typeof google !== 'object' || typeof google.maps !== 'object'){
        console.log("error loading google maps api");
        $('#searchbox').val("Error Loading Google Maps Api");
        $('#searchbox').css({'background-color' : 'rgba(255,0,0,0.5)'});
        //return early since we have no maps.  No point in doing much else.
        return;
    }
    
    self.theMap = new initMap();
    window.map = self.theMap.map;
   
    self.zNum = 1;
    self.refitFilterCheck = ko.observable(true);
    self.refitResizeCheck = ko.observable(true);
    self.searchCategoryCheck = ko.observable(false);
    self.listVisible = ko.observable(true);
    self.rollupText = ko.observable('collapse list');
    self.rollupIconPath = ko.observable('img/collapseIcon.png');
    self.infoMaxWidth = Math.min(400,$(window).width() * .8);
    self.max4Stips = Math.max( 1,
        Math.min( 5, Math.floor( $(window).width() / 200 )));
    
    self.removePoint = function(point) {
        self.points.remove(point);
    };
    
    self.centerToPoint = function(point, offsetIt) {
        if (offsetIt !== true) {
            self.theMap.map.setCenter(point.marker.position);
        }
        else {
            var scale = Math.pow(2, self.theMap.map.getZoom());
            var mapHeight = $(window).height();
            var projection = self.theMap.map.getProjection();
            var pixPosition = projection.fromLatLngToPoint(point.marker.position);
            var pixPosNew = new google.maps.Point(
                pixPosition.x,
                pixPosition.y - (mapHeight * .45 / scale)
            );
            var posLatLngNew = projection.fromPointToLatLng(pixPosNew);
            self.theMap.map.setCenter(posLatLngNew);
        }
    };
    
    self.selectPoint = function(point) {
        var oldPoint = self.currentPoint();
        self.centerToPoint(point, true);
        if ($(window).width() < 800) {self.toggleList(false);}
        self.currentPoint(point);
        var storedContent = sessionStorage.getItem("infoKey" +
            self.currentPoint().name +
            self.currentPoint().lat() + self.currentPoint().long());

        if (storedContent){
            self.infowindow.setContent(storedContent);
            self.infowindow.open(self.theMap.map, point.marker);
            self.infowindow.isOpen = true;
            self.checkPano(true);
        }
        else {
            self.infowindow.setContent('<div id="infoContent" ' +
                'class="scrollFix">loading...</loding>');
            self.infowindow.open(self.theMap.map, point.marker);
            self.infowindow.isOpen = true;
            //this will also check pano and open the infowindow
            self.get4Sinfo(point);
        }
        point.marker.setZIndex(point.marker.getZIndex() + 5000);
        if (point.hovered() === true){
            point.hovered(false);
            self.mouseHere(point);
        }
        else{
            self.mouseGone(point);
        }
        if (oldPoint !== null && oldPoint !== undefined) {
            if (oldPoint.hovered() === true){
                oldPoint.hovered(false);
                self.mouseHere(oldPoint);
            }
            else{
                self.mouseGone(oldPoint);
            }
        }
    };
    
    self.getStyle = function(thisPoint){
        if (thisPoint === self.currentPoint()){
            if(thisPoint.hovered() === true) {
                return 'hoveredCurrentListPoint';
            }
            else {
                return 'currentListPoint';
            }
        }
        else if (thisPoint.hovered() === true){
            return 'hoveredListPoint';
        }
    };
    
    self.mouseHere = function(point) {
        if (point.hovered() !== true) {
            point.hovered(true);
            if (point.marker.getZIndex() <= self.zNum) {
                point.marker.setZIndex(point.marker.getZIndex() + 5000);
            }
            if (self.currentPoint() === point) {
                point.marker.setIcon(point.activeHoverIcon);
            }
            else {
                point.marker.setIcon(point.hoverIcon);
            }
        }
    };
    
    self.mouseGone = function(point) {
        if (point.hovered() === true) {
            point.hovered(false);
        }
            if (point.marker.getZIndex() > self.zNum && point !==
                self.currentPoint()) {

                point.marker.setZIndex(point.marker.getZIndex() - 5000);
            }
            if (self.currentPoint() === point) {
                point.marker.setIcon(point.activeIcon);
            }
            else {
                point.marker.setIcon(point.defaultIcon);
            }

    };


    self.point = function(name, lat, long, draggable, category) {
        this.defaultIcon = 'https://mt.googleapis.com/vt/icon/name=icons/' +
        'spotlight/spotlight-poi.png';
        this.activeHoverIcon = 'https://mt.google.com/vt/icon?psize=20&font=' +
            'fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/' +
            'spotlight-waypoint-a.png&ax=44&ay=48&scale=1&text=X';
        this.activeIcon = 'http://mt.google.com/vt/icon?psize=30&font=fonts/' +
            'arialuni_t.ttf&color=ff00ff00&name=icons/spotlight/spotlight' +
            '-waypoint-a.png&ax=43&ay=48&text=%E2%80%A2';
        this.hoverIcon = 'https://mt.google.com/vt/icon?color=ff004C13&name=' +
            'icons/spotlight/spotlight-waypoint-blue.png';
        this.name = name;
        this.lat = ko.observable(lat);
        this.long = ko.observable(long);
        this.category = category;
        this.hovered = ko.observable(false);

        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            title: name,
            map: self.theMap.map,
            draggable: draggable,
            zIndex: self.zNum
        });
        
        self.zNum++;
        
        google.maps.event.addListener(this.marker, 'click', function() {
            self.selectPoint(this);
        }.bind(this));

        //mouse over event for this point's marker
        google.maps.event.addListener(this.marker, 'mouseover', function() {
            self.mouseHere(this);
        }.bind(this));

        //mouse out event for  this point's marker
        google.maps.event.addListener(this.marker, 'mouseout', function() {
            self.mouseGone(this);
        }.bind(this));
    };

    
    self.points = ko.observableArray([
        new self.point('Pei Wei', 36.060438, -95.847166, false, 'food'),
        new self.point('El Tequila', 36.064201, -95.796419, false, 'food'),
        new self.point('Walmart', 36.059754, -95.817668, false, 'Shopping'),
        new self.point('Woodland Hills Mall', 36.063454, -95.881634, false, 'Shopping'),
        new self.point('Warren Theater', 35.991386, -95.809424, false, 'Entertainment')
    ]);
    
    self.currentPoint = ko.observable();
    
    self.pointFilter = ko.observable('');
    
    self.shownPoints = ko.computed(function() {
        return ko.utils.arrayFilter(self.points(), function(point) {
            if (self.searchCategoryCheck() === true){
                return (self.pointFilter() === '*' ||
                    point.name.toLowerCase().indexOf(self.pointFilter().
                        toLowerCase()) !== -1);
            }
            else{
                return (self.pointFilter() === '*' ||
                    (point.name.toLowerCase().indexOf(self.pointFilter().
                        toLowerCase()) !== -1 ||
                    point.category.toLowerCase().indexOf(self.pointFilter().
                        toLowerCase()) !== -1));
            }
        });
    }, self);
    
    self.shownPoints.subscribe(function() {
        self.toggleMarkers();
        if (self.infowindow.isOpen === true){
            self.infowindow.close();
            self.infowindow.isOpen = false;
            self.infoWindowClosed();
        }
    });
    
    self.listPage = ko.computed(function(){
        return Math.max(1,Math.ceil( self.listPoint()/self.maxListNum()));
    });
    
    self.shownList = ko.computed(function(){
        return self.shownPoints().slice(self.listPoint()-1,
            self.listPoint()-1 + self.maxListNum());
    });
    
    self.totalPages = ko.computed(function(){
        return Math.max(1,Math.ceil(
            self.shownPoints().length/self.maxListNum() ));
    });
    
    self.pageText = ko.computed(function(){
        return 'Current List Page: <strong>' + self.listPage() +
            '</strong> of <strong>' + self.totalPages() +
            '</strong> (' + self.shownPoints().length + ' locations)';
    });
    
    self.prevPageText = ko.computed(function(){
        if (self.listPage() > 1){
            return 'page: ' + (self.listPage() - 1) + ' <' ;
        }
        else {
            self.listPoint(1);
            return self.listPage();
        }
    });
    
    self.nextPageText = ko.computed(function(){
        if (self.totalPages() > self.listPage()){
            return '> page: ' + (self.listPage() + 1) ;
        }
        else {
            return self.listPage();
        }
    });

    self.changePage = function(direction){
        if(direction === 1 && self.totalPages() > self.listPage()){
            self.listPoint(self.listPoint()+self.maxListNum());
        }
        else if(direction === -1 && self.listPage() > 1){
            self.listPoint(self.listPoint()-self.maxListNum());
        }
    };


    self.toggleList = function(makeVisible){
        if (typeof makeVisible !== 'boolean') {
            if (self.listVisible() === 0) {
                makeVisible = true;
            }
            else {
                makeVisible = false;
            }
        }
        
        if(makeVisible === true){
            self.listVisible(1);
            self.rollupText('collapse list');
            self.rollupIconPath('img/collapseIcon.png');
        }
        else if (makeVisible === false){
            self.listVisible(0);
            self.rollupText('expand list');
            self.rollupIconPath('img/expandIcon.png');
        }

    };
    
    self.toggleMarkers = function(){
        var i;
        var pointsLen = self.points().length;
        for (i = 0; i < pointsLen; i++) {
            var thisPoint = self.points()[i];
            thisPoint.marker.setVisible(false);
            thisPoint.hovered(false);
            /* set icons */
            if (self.currentPoint() === thisPoint) {
                thisPoint.marker.setIcon(thisPoint.activeIcon);
            }
            else {
                thisPoint.marker.setIcon(thisPoint.defaultIcon);
            }
        }
      
        for (i = 0; i < pointsLen; i++) {
            var thisPoint = self.shownPoints()[i];
            if (thisPoint) {thisPoint.marker.setVisible(true);}
        }
        if(self.refitFilterCheck() === true){self.refitMap();}
    };
    
    self.refitMap = function() {
        var bounds = new google.maps.LatLngBounds();
        
        var pointsLen = self.shownPoints().length;
        if(pointsLen >= 2) {
            for (var i = 0; i < pointsLen; i++) {
                bounds.extend (self.shownPoints()[i].marker.position);
            }
            self.theMap.map.fitBounds(bounds);
        }
    };
    this.getStreetViewUrl = function(point){
        return 'https://maps.googleapis.com/maps/api/streetview?' +
        'size=300x300&location=' + point.lat() + ',' + point.long();
    };

    self.the4Sstring = '';

    this.get4Sinfo = function(point){
        var url = 'https://api.foursquare.com/v2/venues/search?client_id=' +
            'UA5AQ4KALKBK05HJL3LC14ULKHK0DDY0RPWI1OTPBYTVXCAT' +
            '&client_secret=55MSMSNNK3XPE4RLN2CR05ESC0TJ5T2PVQ4ZP034WWTGBR2B' +
            '&v=20160719' + '&ll=' + point.lat() + ',' +
            point.long() + '&query=\'' + point.name + '\'&limit=1';


        $.getJSON(url)
            .done(function(response){
                /* object */
                self.the4Sstring = '<p>Foursquare info:<br>';
                var venue = response.response.venues[0];
                /* venue id */
                var venueId = venue.id;

                var venueName = venue.name;
                if (venueName !== null && venueName !== undefined){
                    self.the4Sstring = self.the4Sstring + 'name: ' +
                        venueName + '<br>';
                }
                /* phone number */
                var phoneNum = venue.contact.formattedPhone;
                if (phoneNum !== null && phoneNum !== undefined){
                    self.the4Sstring = self.the4Sstring + 'phone: ' +
                        phoneNum + '<br>';
                }
                /* twitter */
                var twitterId = venue.contact.twitter;
                if (twitterId !== null && twitterId !== undefined){
                    self.the4Sstring = self.the4Sstring + 'twitter name: ' +
                        twitterId + '<br>';
                }
                /* address */
                var address = venue.location.formattedAddress;
                if (address !== null && address !== undefined){
                    self.the4Sstring = self.the4Sstring + 'address: ' +
                        address + '<br>';
                }
                /* category */
                var category = venue.categories.shortName;
                if (category !== null && category !== undefined){
                    self.the4Sstring = self.the4Sstring + 'category: ' +
                        category + '<br>';
                }
                /* checkins */
                var checkinCount = venue.stats.checkinsCount;
                if (checkinCount !== null && checkinCount !== undefined){
                    self.the4Sstring = self.the4Sstring + '# of checkins: ' +
                        checkinCount + '<br>';
                }
                /* tips */
                var tipCount = venue.stats.tipCount;
                if (tipCount > 0) {
                    self.get4Stips(venueId, point);
                }
                else{
                    self.the4Sstring = self.the4Sstring + '</p>';
                    self.checkPano();
                }
            })
            .fail(function(){
                self.the4Sstring = 'Fouresquare data request failed';
                console.log('Fouresquare failed to load information' +
                    'attempting to load error  we can get into info window');
                self.checkPano();
            });

    };

    this.get4Stips = function(venueId, point){
        /* the foursquare tips api url */
        var url ='https://api.foursquare.com/v2/venues/' + venueId + '/tips' +
            '?client_id=UA5AQ4KALKBK05HJL3LC14ULKHK0DDY0RPWI1OTPBYTVXCAT' +
            '&client_secret=55MSMSNNK3XPE4RLN2CR05ESC0TJ5T2PVQ4ZP034WWTGBR2B&' +
            'v=20160719';


        $.getJSON(url)
            .done(function(response){

                var tipCount = Math.min(self.max4Stips,
                    response.response.tips.count);

                self.the4Sstring = self.the4Sstring + '<br>tips: <ul>';
                for(var i=0;i<tipCount;i++){
                    self.the4Sstring = self.the4Sstring + '<li>' +
                        response.response.tips.items[i].text + '</li>';
                }

                self.the4Sstring = self.the4Sstring + '</ul></p>';

                self.checkPano();
            })
            .fail(function(){
                self.the4Sstring = self.the4Sstring + '</p>';
                console.log('Fouresquare failed to loads tip information' +
                    ' attempting to load what we have into the infowindow');
                self.checkPano();
            });
    };

    self.defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(35.65, -97.7),
        new google.maps.LatLng(35.5, -97.4));
    /* apply the default bounds */
    self.theMap.map.fitBounds(self.defaultBounds);

    self.contentString = function(includePano){
        var retStr = '<div id="infoContent" class="scrollFix">' +
            self.the4Sstring;
        if (includePano === true) {
            retStr = retStr +
                '<div id="panoContent"></div>';
        }
        retStr = retStr + '</div>';
        /* store the built html string for reuse later this session */
        sessionStorage.setItem("infoKey" + self.currentPoint().name +
            self.currentPoint().lat() + self.currentPoint().long(), retStr);
        /* return the built string */
        return retStr;
    };

    self.infowindow = new google.maps.InfoWindow({
        content: '<div id="infoContent" class="scrollFix">loading...</loding>',
        maxWidth: self.infoMaxWidth
    });

    self.pano = null;

    self.streetViewService = new google.maps.StreetViewService();

    self.checkPano = function(skipContent) {

        if ($(window).width() <= 800) {
            if (skipContent !== true) {
                self.infowindow.setContent(self.contentString(false));
            }
            return;
        }
        self.streetViewService.getPanoramaByLocation(
            self.currentPoint().marker.position,80,
            function (streetViewPanoramaData, status) {

            if (status === google.maps.StreetViewStatus.OK) {
                if (skipContent !== true) {
                    self.infowindow.setContent(self.contentString(true));
                }
                if (self.pano !== null) {
                    self.pano.unbind("position");
                    self.pano.setVisible(false);
                }
                self.pano = new google.maps.StreetViewPanorama(
                    document.getElementById("panoContent"), {

                    navigationControl: true,
                    navigationControlOptions: {
                        style: google.maps.NavigationControlStyle.ANDROID},
                    enableCloseButton: false,
                    addressControl: false,
                    linksControl: false
                });
                self.pano.setPano(streetViewPanoramaData.location.pano);
                self.pano.setVisible(true);
            }
            else {
                if (skipContent !== true) {
                    self.infowindow.setContent(self.contentString(false));
                }
            }
        });
    };

    self.infoWindowClosed = function(){
        if (self.pano !== null && self.pano !== undefined){
            self.pano.unbind("position");
            self.pano.setVisible(false);
            self.pano = null;
        }
        if ($(window).width() < 800) {
            self.toggleList(true);
        }
        self.refitMap();
    };

    google.maps.event.addListener(self.infowindow, 'closeclick', function() {
        self.infoWindowClosed();
    });

    google.maps.event.addListener(self.theMap.map, "click", function(){
        if (self.infowindow.isOpen === true){
            self.infowindow.close();
            self.infowindow.isOpen = false;
            self.infoWindowClosed();
        }
    });

    google.maps.event.addDomListener(self.infowindow, 'domready', function() {
        $('#infoContent').click(function() {
            if ($(window).width() <= 800 && self.infowindow.isOpen === true){
                self.infowindow.close();
                self.infowindow.isOpen = false;
                self.infoWindowClosed();
            }
        });
    });

    $(window).resize(function () {
        self.maxListNum(Math.max(1,Math.ceil(($(window).height() -150)/30)));
        if (self.refitResizeCheck()) {
            self.refitMap();
        }
    });

    self.refitMap();
};


