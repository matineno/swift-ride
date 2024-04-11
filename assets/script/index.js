'use strict';

// Get the button element
const button = document.getElementById('book-ride');
let userPin;

// Initialize Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYXNoYTIwMDQiLCJhIjoiY2x1dDdiemR1MDg5bzJxbXdzaDc1MGp3YiJ9.I918kjkNmLWcylf_ddUhZA';

// Create a new map
const map = new mapboxgl.Map({
    container: 'map', // Specify the container ID
    style: 'mapbox://styles/mapbox/streets-v11', // Choose a map style
    center: [-97.141243, 49.878429], // Set the initial center coordinates
    zoom: 8 // Set the initial zoom level
});

// Add navigation control to the map
map.addControl(new mapboxgl.NavigationControl());

// Check geolocation permissions when the map loads
map.on('load', () => {
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
            console.log('Location permission granted.');
        } else if (result.state === 'prompt') {
            console.log('Location permission prompt will be shown.');
        } else {
            console.log('Location permission denied.');
        }
    });
});

// Function to get client location
function getClientLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLocation = [position.coords.longitude, position.coords.latitude];
                map.flyTo({
                    center: userLocation,
                    zoom: 17,
                    speed: 1,
                    curve: 2,
                    essential: true // Animation is essential for accessibility
                });

                // Remove existing user pin and add a new one
                if (userPin) userPin.remove();
                userPin = new mapboxgl.Marker({
                    color: '#d62111',
                    scale: 0.6
                }).setLngLat(userLocation).addTo(map);
            },
            () => {
                console.log('Unable to retrieve your location.');
            },
            {
                enableHighAccuracy: true // Request high accuracy location
            }
        );
    } else {
        console.log('Geolocation is not supported by your browser.');
    }
}

// Attach click event listener to the button
button.addEventListener('click', getClientLocation);
