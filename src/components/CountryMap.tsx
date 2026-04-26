import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const COUNTRY_COORDS: Record<string, [number, number]> = {
  AF: [33.93, 67.71], AL: [41.15, 20.17], DZ: [28.03, 1.66], AD: [42.55, 1.56],
  AO: [-11.20, 17.87], AG: [17.06, -61.80], AR: [-38.41, -63.62], AM: [40.07, 45.04],
  AU: [-25.27, 133.78], AT: [47.52, 14.55], AZ: [40.14, 47.58], BS: [25.03, -77.40],
  BH: [26.00, 50.55], BD: [23.68, 90.35], BB: [13.19, -59.54], BY: [53.71, 27.95],
  BE: [50.50, 4.47], BZ: [17.19, -88.50], BJ: [9.31, 2.32], BT: [27.51, 90.43],
  BO: [-16.29, -63.59], BA: [43.92, 17.68], BW: [-22.33, 24.68], BR: [-14.24, -51.93],
  BN: [4.54, 114.73], BG: [42.73, 25.49], BF: [12.36, -1.53], BI: [-3.37, 29.92],
  KH: [12.57, 104.99], CM: [3.85, 11.50], CA: [56.13, -106.35], CF: [6.61, 20.94],
  TD: [15.45, 18.73], CL: [-35.68, -71.54], CN: [35.86, 104.20], CO: [4.57, -74.30],
  CR: [9.75, -83.75], HR: [45.10, 15.20], CU: [21.52, -77.78], CY: [35.13, 33.43],
  CZ: [49.82, 15.47], DK: [56.26, 9.50], DJ: [11.83, 42.59], DO: [18.74, -70.16],
  EC: [-1.83, -78.18], EG: [26.82, 30.80], SV: [13.79, -88.90], GQ: [1.65, 10.27],
  ER: [15.18, 39.78], EE: [58.60, 25.01], SZ: [-26.52, 31.47], ET: [9.15, 40.49],
  FJ: [-17.71, 178.07], FI: [61.92, 25.75], FR: [46.23, 2.21], GA: [-0.80, 11.61],
  GM: [13.44, -15.31], GE: [42.31, 43.36], DE: [51.17, 10.45], GH: [7.95, -1.02],
  GR: [39.07, 21.82], GD: [12.12, -61.68], GT: [15.78, -90.23], GN: [9.95, -11.24],
  GY: [4.86, -58.93], HT: [18.97, -72.29], HN: [15.20, -86.24], HU: [47.16, 19.50],
  IS: [64.96, -19.02], IN: [20.59, 78.96], ID: [-0.79, 113.92], IR: [32.43, 53.69],
  IQ: [33.22, 43.68], IE: [53.41, -8.24], IL: [31.05, 34.85], IT: [41.87, 12.57],
  JM: [18.11, -77.30], JP: [36.20, 138.25], JO: [30.59, 36.24], KZ: [48.02, 66.92],
  KE: [-0.02, 37.91], KR: [35.91, 127.77], KW: [29.31, 47.48], KG: [41.20, 74.77],
  LA: [19.86, 102.50], LV: [56.88, 24.60], LB: [33.85, 35.86], LS: [-29.61, 28.23],
  LR: [6.43, -9.43], LY: [26.34, 17.23], LT: [55.17, 23.88], LU: [49.82, 6.13],
  MG: [-18.77, 46.87], MW: [-13.25, 34.30], MY: [4.21, 108.96], MV: [3.20, 73.22],
  ML: [17.57, -3.99], MT: [35.94, 14.38], MR: [21.01, -10.94], MU: [-20.35, 57.55],
  MX: [23.63, -102.55], MD: [47.41, 28.37], MC: [43.75, 7.40], MN: [46.86, 103.85],
  ME: [42.71, 19.37], MA: [31.79, -7.09], MZ: [-18.67, 35.53], MM: [21.92, 95.96],
  NA: [-22.96, 18.49], NP: [28.39, 84.12], NL: [52.13, 5.29], NZ: [-40.90, 174.89],
  NI: [12.87, -85.21], NE: [17.61, 8.08], NG: [9.08, 8.68], NO: [60.47, 8.47],
  OM: [21.51, 55.92], PK: [30.38, 69.35], PA: [8.54, -80.78], PG: [-6.31, 143.96],
  PY: [-23.44, -58.44], PE: [-9.19, -75.02], PH: [12.88, 121.77], PL: [51.92, 19.15],
  PT: [39.40, -8.22], QA: [25.35, 51.18], RO: [45.94, 24.97], RU: [61.52, 105.32],
  RW: [-1.94, 29.87], SA: [23.89, 45.08], SN: [14.50, -14.45], RS: [44.02, 21.01],
  SC: [-4.68, 55.49], SL: [8.46, -11.78], SG: [1.35, 103.82], SK: [48.67, 19.70],
  SI: [46.15, 14.99], SO: [5.15, 46.20], ZA: [-30.56, 22.94], SS: [4.86, 31.57],
  ES: [40.46, -3.75], LK: [7.87, 80.77], SD: [12.86, 30.22], SR: [3.92, -56.03],
  SE: [60.13, 18.64], CH: [46.82, 8.23], SY: [34.80, 38.99], TW: [23.70, 120.96],
  TJ: [38.86, 71.28], TZ: [-6.37, 34.89], TH: [15.87, 100.99], TL: [-8.87, 125.73],
  TG: [8.62, 0.82], TT: [10.69, -61.22], TN: [33.89, 9.54], TR: [38.96, 35.24],
  TM: [38.97, 59.56], UG: [1.37, 32.29], UA: [48.38, 31.17], AE: [23.42, 53.85],
  GB: [55.38, -3.44], US: [37.09, -95.71], UY: [-32.52, -55.77], UZ: [41.38, 64.59],
  VE: [6.42, -66.59], VN: [14.06, 108.28], YE: [15.55, 48.52], ZM: [-13.13, 27.85],
  ZW: [-19.02, 29.15],
}

interface Props {
  countryCode: string
  countryName: string
  flag: string
}

export default function CountryMap({ countryCode, countryName, flag }: Props) {
  const coords = COUNTRY_COORDS[countryCode.toUpperCase()] || [0, 0]

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', height: 300, border: '1px solid rgba(255,255,255,0.08)' }}>
      <MapContainer
        center={coords}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords}>
          <Popup>
            {flag} {countryName}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
