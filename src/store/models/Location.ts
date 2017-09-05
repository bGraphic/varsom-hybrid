export interface Position {
  latitude: number,
  longitude: number,
  timestamp?: Date 
}

export interface PositionError {
  code: number,
  message: string
}