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
                    {props.addressesToRender.map(address => {
                        return (
                            <Marker key={address.address} position={{
                                lat: address.position.lat,
                                lng: address.position.lng
                            }} />
                        )
                    })}
                </GoogleMap>
            </LoadScript>
        </div>
    )
}
