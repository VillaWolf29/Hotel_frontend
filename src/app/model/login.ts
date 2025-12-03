// Interfaz para colocar las credenciales
export interface JwtRequest {
  username: string;
  password: string;
}

// Interfaz para la respuesta del login
export interface JwtResponse {
  access_token: string;
}

// Interfaz para el usuario autenticado
export interface AuthUser {
  username: string;
  roles?: string[];
  token?: string;
}

/**
 * Interfaz para el registro de nuevos usuarios/clientes
 * Incluye todos los campos necesarios para crear una cuenta completa
 */
export interface CustomerRequest {
  firstName: string;        // 3-70 caracteres, obligatorio
  lastName: string;         // 3-70 caracteres, obligatorio
  username: string;         // Nombre de usuario, obligatorio (mínimo 4 caracteres)
  phone: string;            // Exactamente 9 dígitos, obligatorio
  idCard: string;           // Exactamente 8 dígitos, obligatorio
  address?: string;         // Máx 100 caracteres, opcional
  password: string;         // Contraseña para la cuenta, obligatorio (mínimo 6 caracteres)
}

/**
 * Interfaz para la respuesta del registro de cliente
 */
export interface CustomerResponse {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  idCard: string;
  address?: string;
  message?: string;
}

/**
 * @deprecated Use CustomerRequest instead
 * Kept for backward compatibility
 */
export type RegisterRequest = CustomerRequest;

/**
 * @deprecated Use CustomerResponse instead
 * Kept for backward compatibility
 */
export type RegisterResponse = CustomerResponse;