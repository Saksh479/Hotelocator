// Used in: show.ejs
mapboxgl.accessToken = mapToken;
const hotelData = JSON.parse(hotel);
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	center: hotelData.geometry.coordinates, // starting position [lng, lat]
	zoom: 10, // starting zoom
});

const marker = new mapboxgl.Marker()
    .setLngLat(hotelData.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h5>${hotelData.title}</h3><p>${hotelData.location}</p>`
            )
    )
    .addTo(map);