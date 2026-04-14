import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import '../../utils/leaflet'

export default function HospitalsMapView({hospitals}) {
    const defaultCenter = [-25.2637, -57.5759]

    const center =
      hospitals.length > 0
        ? [Number(hospitals[0].lat), Number(hospitals[0].lng)]
        : defaultCenter

    return (
      <div className="h-[500px] w-full rounded-xl overflow-hidden border border-slate-200">
          <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom
            className="h-full w-full"
          >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {hospitals.map((hospital) => (
                <Marker
                  key={hospital.id}
                  position={[Number(hospital.lat), Number(hospital.lng)]}
                >
                    <Popup>
                        <div className="space-y-1">
                            <h3 className="font-semibold">{hospital.name}</h3>
                            <p>{hospital.address}</p>
                            <p className="text-xs text-slate-500">
                                Lat: {hospital.lat}, Lng: {hospital.lng}
                            </p>
                        </div>
                    </Popup>
                </Marker>
              ))}
          </MapContainer>
      </div>
    )
}