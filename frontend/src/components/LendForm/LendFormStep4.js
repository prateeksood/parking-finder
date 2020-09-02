import styles from "./LendFormInput.module.css";
import React, { useEffect, useRef } from "react";
import { TimelineMax } from "gsap";
import mapboxgl from "mapbox-gl";
export default props => {
  useEffect(() => {
    const LoadTl = new TimelineMax();
    LoadTl.from("#map", 0.5, {
      autoAlpha: 0,
      y: -50
    });
  }, []);
  mapboxgl.accessToken =
    "pk.eyJ1IjoicHJhdGVla3Nvb2QxMjMiLCJhIjoiY2s2MGttZTI2MDg5eTNscGtzYzhhaDhzMSJ9.79PJAfp5iIp7FVeHhT-YSQ";
  let mapContainer = useRef();
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [props.viewport.lng, props.viewport.lat],
      zoom: props.viewport.zoom
    });
    let marker = new mapboxgl.Marker({
      draggable: true,
      color: "orange"
    });
    map.addControl(
      new window.MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false
      }),
      "top-right"
    );
    map.addControl(new mapboxgl.FullscreenControl(), "bottom-right");
    map.addControl(new mapboxgl.NavigationControl(), "top-left");
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
    );
    marker.setLngLat([props.viewport.lng, props.viewport.lat]).addTo(map);
    const onDragEnd = () => {
      let lngLat = marker.getLngLat();
      props.setViewport({
        lng: lngLat.lng,
        lat: lngLat.lat,
        zoom: map.getZoom().toFixed(2)
      });
      marker.setLngLat([lngLat.lng, lngLat.lat]);
      map.setCenter([lngLat.lng, lngLat.lat]);
    };
    marker.on("dragend", onDragEnd);

    map.on("move", () => {
      props.setViewport({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
      marker.setLngLat([
        map.getCenter().lng.toFixed(4),
        map.getCenter().lat.toFixed(4)
      ]);
    });
  }, []);
  return (
    <div id="map" className={styles.mapcontainer}>
      <div
        style={{ height: "100%", width: "100%" }}
        ref={el => (mapContainer = el)}
        className="mapContainer"
      ></div>
    </div>
  );
};
