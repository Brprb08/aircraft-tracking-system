export const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const diffLong = toRadians(lon2 - lon1);
  
    const x = Math.sin(diffLong) * Math.cos(lat2Rad);
    const y = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(diffLong);
  
    let initialBearing = Math.atan2(x, y);
    initialBearing = (initialBearing * 180) / Math.PI;
    const compassBearing = (initialBearing + 360) % 360;
  
    return compassBearing;
  };