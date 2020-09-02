import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

import { AddressType, PositionType } from '../types'

type MapProps = {
    addressesToRender: AddressType[]
    centrePoint: PositionType
    mapsApiKey: string
}

export function MapWidget (props: MapProps) {
    const containerStyle = {
        width: 'auto',
        height: '700px'
    }
    let rangeOfPropertiesSameGeoLocation: number[] = []
    return (
        <div id="map">
            <LoadScript
                googleMapsApiKey={props.mapsApiKey}
            >
                <GoogleMap
                    center={props.centrePoint}
                    zoom={11}
                    mapContainerStyle={containerStyle}
                >
                    <Marker position={{
                        lat: props.centrePoint.lat,
                        lng: props.centrePoint.lng
                    }} label={'0'} >
                        {props.addressesToRender.map((address, index) => {
                            const sameGeoLocation = address.position.lat === props.addressesToRender[index + 1]?.position.lat && address.position.lng === props.addressesToRender[index + 1]?.position.lng
                            let markerValue
                            if (sameGeoLocation) {
                                rangeOfPropertiesSameGeoLocation.push(index)
                            } else {
                                const markerRange = rangeOfPropertiesSameGeoLocation.length
                                markerValue = markerRange !== 0 ? `${rangeOfPropertiesSameGeoLocation[0] + 1}-${index + 1}` : `${index + 1}`
                                rangeOfPropertiesSameGeoLocation = []
                            }
                            return (
                                <Marker key={`${address.address}-${index}`} position={{
                                    lat: address.position.lat,
                                    lng: address.position.lng
                                }} label={markerValue} zIndex={1}/>
                            )
                        })}
                    </Marker>
                </GoogleMap>
            </LoadScript>
        </div>
    )
}
