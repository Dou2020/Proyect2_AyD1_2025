/**
 * Modelo para tarifa base (ej. {"name":"tarifa_base_global","value":17.0})
 */
export interface BaseFreeModel {
  name: string;
  value: number;
}

/**
 * Modelo para un valor nuevo (ej. {"newValue": 0.1})
 */
export interface NewValueModel {
  newValue: number;
}
